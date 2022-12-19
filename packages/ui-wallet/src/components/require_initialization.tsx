import { UserWallet } from '@skiawallet/entities';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
// import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';

import { stateUserWallet, stateUserWalletEncrypted } from '../state/wallet/wallet';
import { decryptString } from '../utils/encryption';
import { routes } from '../utils/routes';
import Button from './atomic/button';
// import { routes } from '../utils/routes';
import OnboardingPassword from './onboarding_password';

export default function RequireInitialization({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const userWalletEncrypted = useRecoilValue(stateUserWalletEncrypted);
  const [userWallet, setUserWallet] = useRecoilState(stateUserWallet);
  const [loadingWallet, setLoadingWallet] = useState(false);
  // const location = useLocation();

  const [password, setPassword] = useState('');

  const handleClickToContinue = () => {
    const walletDecrypted = decryptString(userWalletEncrypted!, password)
    if (walletDecrypted.ok) {
      setLoadingWallet(true)
      const jsonWallet = JSON.parse(walletDecrypted.val)
      setUserWallet(UserWallet.parse(jsonWallet))
    }
  }

  if (userWalletEncrypted !== null) {
    if (userWallet) return children
    else
      return (
        <div>
          <OnboardingPassword onChangeText={setPassword}></OnboardingPassword>
          <Button loading={loadingWallet} onClick={handleClickToContinue} className="mt-6">
            Enter wallet
          </Button>
        </div>
      );
  } else {
    return (
      <Navigate
        to={`/${routes.initialization}`}
        state={{ from: location }}
      // replace  
      />
    )
    // return children;
  }
}
