import { useRecoilValue } from 'recoil';
import { stateUserWallet } from '../state/wallet';
import { UserWallet } from '../utils/wallet_entity';

export default function WalletAccount() {
  const wallet = useRecoilValue<UserWallet | null>(
    stateUserWallet(localStorage)
  );
  return (
    <div>
      <div>
        <h2>Wallet Account</h2>
      </div>
      <div>Public key:{wallet.firstAccount.address}</div>
    </div>
  );
}
