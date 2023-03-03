export const setPresist = (key: string, data: any) => {
  if (typeof data == "function") {
    const res = data();
    if (res instanceof Promise) {
      res.then((r) => setPresist(key, r));
    } else {
      setPresist(key, res);
    }
  } else if (typeof data == "object") {
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    localStorage.setItem(key, data);
  }
};

export const getPresist = (key: string) => {
  let body = localStorage.getItem(key);
  try {
    body = JSON.parse(body || "");
  } catch (e) {
    console.error(e);
  }
  return body as any;
};
