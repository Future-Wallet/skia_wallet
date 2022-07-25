import { atom } from 'recoil';
import { UserWallet } from '../utils/wallet_entity';
import { localStorageRecoil } from './storage';

type FormMnemonicInput = {
  value: string;
  error?: string;
};

export const stateFormMnenomicKey = 'state_form_mnenomic';

/**
 * State of the form for the mnemonic phrase
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
 */
export function stateUserWallet(storage: Storage) {
  return atom<UserWallet | null>({
    key: stateUserWalletKey,
    default: null,
    effects: [localStorageRecoil(stateUserWalletKey, storage)],
  });
}

// setMnemonicOfUser(mnemonicInput);
// setSeedOfUser(seed);
// setPrivateKeyOfUser0x(firstAccount.privateKey);
// setPrivateKeyOfUser(firstAccount.privateKey.substring(2));
// setaddressOfUser(firstAccount.address);
// setBalance(yourNumber);
