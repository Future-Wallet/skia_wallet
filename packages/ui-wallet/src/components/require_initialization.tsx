import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

import { stateUserWallet } from '../state/wallet';
import { routes } from '../utils/routes';
import { UserWallet } from '../utils/wallet_entity';

export default function RequireInitialization({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const userWalletLoadable = useRecoilValueLoadable<UserWallet | null>(
    stateUserWallet
  );
  const location = useLocation();

  switch (userWalletLoadable.state) {
    case 'hasValue':
      if (userWalletLoadable.contents == null) {
        return (
          <Navigate
            to={`/${routes.initialization}`}
            state={{ from: location }}
            replace
          />
        );
      } else {
        return children;
      }
    case 'loading':
      return <div>Loading</div>;
    default:
      return <div>Error while loading the data...</div>;
  }
}
