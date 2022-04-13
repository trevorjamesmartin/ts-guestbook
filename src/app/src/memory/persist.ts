export const toStorage = (state:any, key:any|undefined) => {
    try {
        let localStorageKey = key?.length > 0 ? key : 'state';
        localStorage.setItem(localStorageKey, JSON.stringify(state));
    } catch (e) {
        console.log(e);
    }
};

export const fromStorage = (key:any|undefined) => {
    try {
        let localStorageKey = key?.length > 0 ? key : 'state';
        const stateStr = localStorage.getItem(localStorageKey);
        return stateStr ? JSON.parse(stateStr) : undefined;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

export const storageKey = undefined;

export const persistedStore = fromStorage(storageKey);
