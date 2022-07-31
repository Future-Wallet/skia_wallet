import { useRecoilStateLoadable } from 'recoil';
import SendMoney from '../components/send_money';
import WalletAccount from '../components/wallet_account';
import { stateUserWallet } from '../state/wallet';

export default function Home(): JSX.Element {
  const [userWalletLoadable] = useRecoilStateLoadable(stateUserWallet);

  return (
    <main className="h-screen">
      <div className="h-screen flex flex-col">
        <div className="grow" />
        <div className="grow-0 flex-col mx-auto">
          {userWalletLoadable.state === 'hasValue' ? (
            <div className="m-auto max-w-xl min-w-max">
              <div>
                <WalletAccount />
              </div>
              <div>
                <SendMoney />
              </div>
            </div>
          ) : (
            'Loading...'
          )}
        </div>
        <div className="grow" />
      </div>
    </main>
  );
}
