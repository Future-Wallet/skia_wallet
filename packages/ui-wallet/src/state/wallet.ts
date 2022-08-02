import { atom, selector } from 'recoil';

import Api from '../utils/api';
import { UserWallet } from '../utils/wallet_entity';
import { localStorageRecoil } from './storage';

type FormMnemonicInput = {
  value: string;
  error?: string | null;
};

export const stateFormMnenomicKey = 'state_form_mnenomic';

/**
 * State of the form for the mnemonic phrase
 *
 * @returns atom
 */
export const stateFormMnenomic = atom<FormMnemonicInput>({
  key: stateFormMnenomicKey,
  // // get initial state from local storage
  // default: JSON.parse(localStorage.getItem('user'))
  default: {
    value: '',
    error: null,
  },
});

export const stateUserWalletKey = 'state_user_wallet';

/**
 * State of user wallet.
 *
 * @returns UserWallet or null
 */
export const stateUserWallet = atom<UserWallet | null>({
  key: stateUserWalletKey,
  default: null,
  effects: [localStorageRecoil<UserWallet | null>(stateUserWalletKey)],
});

export const stateBalanceOfAccountKey = 'state_balance_of_account';
export const stateBalanceOfAccount = atom<string | null>({
  key: stateBalanceOfAccountKey,
  default: null,
});

/**
 *  Allow calling get balance of account recurrently
 *
 * @returns atom
 */
export const stateSelectorBalanceOfAccount = selector<string | null>({
  key: stateBalanceOfAccountKey + '_selector',
  get: async ({ get }): Promise<string> => {
    const wallet = get(stateUserWallet);

    if (wallet != null) {
      return await Api.getBalance(wallet.props.accounts[0].props.publicAddress);
    } else {
      throw Error('Error loading wallet');
    }
  },
  // set: ({ set }, newValue) => {
  //   set(stateBalanceOfAccount, newValue);
  // },
});
// export const stateBalanceOfAccount = atom<string | null>({
//   key: stateBalanceOfAccountKey,
//   default: null,
//   effects: [
//     ({ setSelf, getLoadable }) => {
//       console.log('getLoadable 1');
//       const wallet = getLoadable(stateUserWallet).contents;

//       console.log('getLoadable 2');
//       if (wallet != null) {
//         setSelf(
//           Api.getBalance(wallet.props.accounts[0].props.publicAddress).then(
//             (balance) => balance
//           )
//         );
//       }
//     },
//   ],
// });
