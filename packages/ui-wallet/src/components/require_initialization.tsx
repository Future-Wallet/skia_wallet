import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { stateUserWallet } from '../state/wallet/wallet';
import { routes } from '../utils/routes';

export default function RequireInitialization({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const userWallet = useRecoilValue(stateUserWallet);
  const location = useLocation();

  if (userWallet === null) {
    console.log(userWallet);
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
}
