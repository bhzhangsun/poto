import { listen, emit } from "@tauri-apps/api/event";
import { getCurrent } from "@tauri-apps/api/window";
import { randomUUID } from "crypto";
import { useEffect, useState } from "react";
import { getPresist, setPresist } from "./usePresist";

export const usePresistSync = (key: string, dep: any[] = []) => {
  const { label } = getCurrent();
  const registerSync = (update: (v: any) => void) => {
    emit("presist-register", { key, label });
    console.log("window label:", label);
    listen("presist-sync", (e) => {
      const { key, label: sender } = e.payload as {
        key: string;
        label: string;
      };
      const v = getPresist(key);
      update(v);
    });
  };

  const dispatchSync = () => {
    emit("presist-dispatch", { key: key, label });
  };

  return { registerSync, dispatchSync };
};

export function useSyncState<T>(key: string, value: T) {
  const presistKey = `presist-${key}`;
  const getInitialValue = () => {
    const presistValue = getPresist(presistKey);
    return presistValue == null ? value || null : presistValue;
  };

  const [state, setState] = useState<T>(getInitialValue);
  const { registerSync, dispatchSync } = usePresistSync(presistKey);

  const setSyncState = (value: React.SetStateAction<T>) => {
    setPresist(presistKey, value);
    dispatchSync();
    setState(value);
  };

  useEffect(() => {
    registerSync((v) => setState(v));
  }, [key]);

  return [state, setSyncState] as [T, (value: React.SetStateAction<T>) => void];
}
