import { atom } from 'recoil';
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
 * @returns atom
 */
export const stateUserWallet = atom<UserWallet | null>({
  key: stateUserWalletKey,
  default: null,
  effects: [localStorageRecoil<UserWallet | null>(stateUserWalletKey)],
});

export const stateBalanceOfAccountKey = 'state_balance_of_account';
/**
 *  Get balance of account
 *
 * @returns atom
 */
export const stateBalanceOfAccount = atom<number | null>({
  key: stateBalanceOfAccountKey,
  default: null,
});

// setMnemonicOfUser(mnemonicInput);
// setSeedOfUser(seed);
// setPrivateKeyOfUser0x(firstAccount.privateKey);
// setPrivateKeyOfUser(firstAccount.privateKey.substring(2));
// setaddressOfUser(firstAccount.address);
// setBalance(yourNumber);
