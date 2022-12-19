import { AtomEffect, DefaultValue } from 'recoil';

/**
 * Save the entity to the Browser's local storage.
 *
 * @param stateKey {string}
 * @returns
 */
export const localStorageRecoil = (stateKey: string): AtomEffect<string | null> =>
  ({ setSelf, onSet }) => {
    const storage = localStorage;
    // Get data of the according key.
    const savedValue = storage.getItem(stateKey);

    onSet(
      (
        newValue: string | null,
        _: string | null | DefaultValue,
        isReset: boolean
      ) => {
        (isReset || !newValue)
          ? storage.removeItem(stateKey)
          : storage.setItem(stateKey, newValue!);
      }
    );

    setSelf(savedValue);
  };


