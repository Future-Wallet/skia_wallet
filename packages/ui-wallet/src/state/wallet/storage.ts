import { Mnemonic, MnemonicLocale, UserWallet } from '@skiawallet/entities';
import { AtomEffect, DefaultValue } from 'recoil';

import { stateUserWalletKey } from './wallet';

/**
 * Save the entity to the Browser's local storage.
 *
 * @param stateKey {string}
 * @returns
 */
export const localStorageRecoil =
  <UserWallet>(stateKey: string): AtomEffect<UserWallet | null> =>
    ({ setSelf, onSet }) => {
      const storage = localStorage;
      // Get data of the according key.
      const savedValue = storage.getItem(stateKey);

      if (savedValue != null) {
        // Make a transformation for specific local storage data.
        if (stateKey === stateUserWalletKey) {
          // Convert plain data saved on the local storage to Skia Wallet's entity.
          const entity = plainObjectToEntity(JSON.parse(savedValue));

          if (entity !== null) {
            // Initialize the initial value of the atom, or asynchronously
            // called later to change it.
            setSelf(entity as UserWallet);
          }
        }

        // Subscribe to state changes and persist them to the storage.
        onSet(
          (
            newValue: UserWallet | null,
            _: UserWallet | null | DefaultValue,
            isReset: boolean
          ) => {
            console.log('onSet', isReset, newValue)
            // isReset
            //   ? storage.removeItem(stateKey)
            //   : storage.setItem(stateKey, JSON.stringify(newValue));
          }
        );
      }
    };

type PlainObject = {
  props: {
    mnemonicPhrase: string;
    privateAddress: string;
    publicAddress: string;
    seed: string;
    accounts: [
      {
        props: {
          mnemonicPhrase: string;
          privateAddress: string;
          publicAddress: string;
          path: string;
        };
      }
    ];
  };
};

function plainObjectToEntity(object: PlainObject): UserWallet | null {
  const userWallet = UserWallet.create({
    mnemonic: Mnemonic.create({
      locale: MnemonicLocale.en,
      value: object.props.mnemonicPhrase,
    }).unwrap(),
  });

  if (userWallet.ok) return userWallet.val;

  return null;
}
