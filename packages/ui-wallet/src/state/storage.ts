import { DefaultValue } from 'recoil';

export const localStorageRecoil =
  <T>(key: string) =>
  ({ setSelf, onSet }: any) => {
    const storage = localStorage;

    // Get data of the according key.
    const savedValue = storage.getItem(key);

    if (savedValue != null) {
      // Initialize the initial value of the atom, or asynchronously
      // called later to change it.
      setSelf(JSON.parse(savedValue));
    }

    // Subscribe to state changes and persist them to the storage.
    onSet((newValue: T, _: T | DefaultValue, isReset: boolean) => {
      isReset
        ? storage.removeItem(key)
        : storage.setItem(key, JSON.stringify(newValue));
    });
  };
