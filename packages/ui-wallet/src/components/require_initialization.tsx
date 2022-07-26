import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { stateUserWallet } from '../state/wallet';
import { routes } from '../utils/routes';
import { UserWallet } from '../utils/wallet_entity';

export default function RequireInitialization({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const location = useLocation();

  const userWallet = useRecoilValue<UserWallet | null>(stateUserWallet);

  if (userWallet == null) {
    console.log(userWallet);
    return (
      <Navigate
        to={`/${routes.initialization}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
