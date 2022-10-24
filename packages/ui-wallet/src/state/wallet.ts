import { atom, selector } from 'recoil';
import { UserWallet } from '@skiawallet/entities';

import { localStorageRecoil } from './storage';
import { Api } from '@skiawallet/repositories';
import { Error as CError } from '@skiawallet/common';

type FormMnemonicInput = {
  value: string;
  error: CError<unknown> | CError<unknown>[] | null;
};

export const stateFormMnenomicKey = 'state_form_mnenomic';

/**
 * State of the form for the mnemonic phrase
 *
 * @returns Recoil's atom
 */
export const stateFormMnenomic = atom<FormMnemonicInput>({
  key: stateFormMnenomicKey,
  default: {
    value: '',
    error: null,
  },
});

export const stateUserWalletKey = 'state_user_wallet';

/**
 * State of the user wallet.
 *
 * @returns Instance of `UserWallet` or `null`
 */
// export const stateUserWallet = atom<UserWallet | null>({
//   key: stateUserWalletKey,
//   default: null,
//   effects: [localStorageRecoil<UserWallet | null>(stateUserWalletKey)],
// });
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
      return await Api.getBalance(
        (wallet as UserWallet).accounts[0].publicAddress
      );
    } else {
      throw Error('Error loading wallet');
    }
  },
});
