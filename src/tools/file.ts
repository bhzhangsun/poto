
export async function selectFile(attrs: {[key:string]: string}): Promise<FileList | null> {
    const selector = document.createElement('input')
    
    return new Promise(resolve => {
        // document.body.appendChild(selector);
        selector.addEventListener('change', (e) => resolve((e?.target as HTMLInputElement)?.files));
        // selector.addEventListener('input', (e) => resolve(e));
        attrs = {...attrs, type: 'file'}
        for (const key in attrs) {
            selector.setAttribute(key, attrs[key])
        }
        selector.click();
    })
}