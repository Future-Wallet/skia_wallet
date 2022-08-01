import SendMoney from '../components/send_money';
import WalletAccount from '../components/wallet_account';

export default function Home(): JSX.Element {
  return (
    <main className="h-screen">
      <div id={Home.name} className="mt-5 h-screen flex flex-col">
        <div className="grow-0 flex-col mx-auto">
          <div className="m-auto max-w-xl">
            <div>
              <WalletAccount />
            </div>
            <div>
              <SendMoney />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
