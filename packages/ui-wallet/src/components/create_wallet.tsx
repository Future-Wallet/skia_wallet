import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { stateUserWallet, stateUserWalletEncrypted } from '../state/wallet/wallet';
import { routes } from '../utils/routes';
import Button from './atomic/button';
import { UserWallet } from '@skiawallet/entities';
import OnboardingPassword from './onboarding_password';
import { encryptString } from '../utils/encryption';

export default function CreateWallet(): JSX.Element | null {
  const navigate = useNavigate();
  const [userWallet, setUserWallet] = useRecoilState(stateUserWallet);
  const [, setUserWalletEncrypted] = useRecoilState(stateUserWalletEncrypted);
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSetPassword = () => {
    const walletAsJson = JSON.stringify(userWallet)
    const encryptedWallet = encryptString(walletAsJson, password)

    setUserWalletEncrypted(encryptedWallet)
    navigate(`/${routes.home}`, { replace: true });
  }

  function handleCreateWallet() {
    setCreating(true);

    const userWallet = UserWallet.create();

    if (userWallet.ok) setUserWallet(userWallet.val);
    else console.error(userWallet.val);

    setCreating(false);
  }

  return (
    <>
      <p className="mb-3 text-gray-700">
        It creates a new unique private key in format of 12 words
      </p>
      <Button
        loading={creating}
        disabled={userWallet !== null}
        onClick={handleCreateWallet}
        className="mt-6"
      >
        Create a new wallet
      </Button>
      {userWallet !== null ? (
        <>
          <p className="mt-5 text-gray-700">
            Write the new private phrase down on a safe place.
          </p>
          <textarea
            rows={4}
            readOnly={true}
            className="mt-2 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={userWallet.mnemonicPhrase.value}
          />
          <div>
            <OnboardingPassword onChangeText={setPassword}></OnboardingPassword>
          </div>
          {password ? <Button onClick={handleSetPassword} className="mt-6">
            Set password and continue
          </Button> : null}
        </>
      ) : null}
    </>
  );
}
