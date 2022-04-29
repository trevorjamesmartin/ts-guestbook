export const toStorage = (state:any, key:string) => {
    try {
        localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
        console.log(e);
    }
};

export const fromStorage = (key:any|undefined) => {
    try {
        const stateStr = localStorage.getItem(key);
        return stateStr ? JSON.parse(stateStr) : undefined;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export const storageKey = "state";

export const persistedStore = fromStorage(storageKey);
