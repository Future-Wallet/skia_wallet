import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilTransaction_UNSTABLE } from 'recoil';
import * as _ from 'lodash'

import { stateFormMnenomic, stateUserWallet, stateUserWalletEncrypted } from '../state/wallet/wallet';
import { routes } from '../utils/routes';
import { Mnemonic, MnemonicLocale, UserWallet } from '@skiawallet/entities';
import Button from './atomic/button';
import OnboardingPassword from './onboarding_password';
import { encryptString } from '../utils/encryption';


export default function ImportWallet(): JSX.Element {
  const navigate = useNavigate();
  const [mnemonicInput, setMemonicInput] = useRecoilState(stateFormMnenomic);
  const [importing, setImporting] = useState(false);
  const [password, setPassword] = useState('');
  const [userWalletToStore, setUserWalletToStore] = useState<UserWallet | null>(null);


  const setWallet = useRecoilTransaction_UNSTABLE(({ set }) => (wallet: UserWallet, password: string) => {
    const walletAsJson = JSON.stringify(wallet)
    console.log('walletAsJson', walletAsJson)
    const text = encryptString(walletAsJson, password)

    // set(stateUserWalletEncryptedIV, iv)
    set(stateUserWalletEncrypted, text)
    set(stateUserWallet, wallet)

  });

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemonicInput({ value: event.target.value, error: null });
  };

  const handleSetPassword = () => {
    setWallet(userWalletToStore!, password)
    navigate(`/${routes.home}`, { replace: true });
  }

  const handleUserWallet = () => {
    let importedUserWallet;
    const mnemonic = Mnemonic.create({
      value: mnemonicInput.value,
      locale: MnemonicLocale.en,
    });

    setImporting(true);

    if (mnemonic.err) {
      console.error(mnemonic.val);

      setMemonicInput({
        ...mnemonicInput,
        ...{ error: mnemonic.val },
      });
    } else {
      importedUserWallet = UserWallet.create({ mnemonic: mnemonic.val });



      if (importedUserWallet.ok) {

        setUserWalletToStore(importedUserWallet.val)

      } else {
        setMemonicInput({
          ...mnemonicInput,
          ...{ error: importedUserWallet.val },
        });
      }
    }
    setImporting(false);
  };

  return (
    <>
      <p className="mb-3 font-normal text-gray-700">
        Write here your private phrase to allow access to your data
      </p>
      <form>
        <textarea
          rows={3}
          className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Ex: above banana elevator camp..."
          value={mnemonicInput.value}
          onChange={onChangeTextArea}
        />

        {mnemonicInput.error !== null ? (
          Array.isArray(mnemonicInput.error) ? (
            mnemonicInput.error.map((err, index) => (
              <p key={index} className="mb-3 text-sm text-red-600">
                {err.message}
              </p>
            ))
          ) : (
            <p className="mb-3 text-sm text-red-600">
              {mnemonicInput.error.message}
            </p>
          )
        ) : null}


        {!_.isNull(userWalletToStore) ?
          <div>
            <OnboardingPassword onChangeText={setPassword}></OnboardingPassword>
          </div>
          : <Button loading={importing} onClick={handleUserWallet} className="mt-6">
            Import your wallet
          </Button>}

        {password ? (
          <Button onClick={handleSetPassword} className="mt-6">
            Set password and continue
          </Button>
        ) : null}
      </form>


    </>
  );
}
