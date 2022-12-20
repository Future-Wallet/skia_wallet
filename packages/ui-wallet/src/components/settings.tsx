import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { stateUserWallet, stateUserWalletEncrypted } from '../state/wallet/wallet';
import { decryptString } from '../utils/encryption';
import { copyValueToClipboard } from '../utils/miscellaneous';
import Button from './atomic/button';
import OnboardingPassword from './onboarding_password';

export default function Settings(): JSX.Element {
  const [userWalletEncrypted, setUserWalletEncrypted] = useRecoilState(stateUserWalletEncrypted);
  const userWallet = useRecoilValue(stateUserWallet);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [password, setPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);

  const handleValidatePassword = () => {
    const walletDecrypted = decryptString(userWalletEncrypted!, password)
    setShowMnemonic(walletDecrypted.ok)
    setWrongPassword(!walletDecrypted.ok)
  }

  return (
    <div>
      {showMnemonic ?
        <div>
          <p>Your private phrase</p>
          <textarea
            rows={3}
            readOnly={true}
            className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={userWallet?.mnemonicPhrase.value}
          />
          <Button
            onClick={() => {
              if (userWallet !== null) {
                copyValueToClipboard(userWallet.mnemonicPhrase.value);
              }
            }}
          >
            Copy address
          </Button>
        </div>
        :
        <div>
          <p>Enter your password to see your seed phrase</p>
          <OnboardingPassword onChangeText={setPassword}></OnboardingPassword>
          <Button onClick={handleValidatePassword} className="mt-6">
            Enter wallet
          </Button>
          {wrongPassword ? <p>Wrong password</p> : null}
        </div>}
      <p className="mt-8 mb-2">
        Delete all your data from this browser (it won't delete any data on the
        blockchain)
      </p>
      <Button
        onClick={() => {
          // Delete data of the `localStorage`
          setUserWalletEncrypted(null);
        }}
      >
        Delete data
      </Button>
    </div>
  );
}
