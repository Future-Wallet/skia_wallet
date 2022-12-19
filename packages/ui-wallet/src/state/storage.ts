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

    if (savedValue == null) {
      onSet(
        (
          newValue: string | null,
          _: string | null | DefaultValue,
          isReset: boolean
        ) => {
          // console.log('onSet', isReset, newValue)
          isReset
            ? storage.removeItem(stateKey)
            : storage.setItem(stateKey, newValue!);
        }
      );
    } else {
      setSelf(savedValue);
    }
  };


