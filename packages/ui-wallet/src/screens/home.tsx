import SendMoney from '../components/send_money';
import HomeNFTList from '../components/home_nft_list';
import WalletAccount from '../components/wallet_account';
import SwapBox from '../components/swap_box';

export default function Home(): JSX.Element {
  return (
    <main className="h-screen">
      <div id={Home.name} className="mt-5 h-screen flex flex-col">
        <div className="grow-0 flex-col mx-auto">
          <div className="m-auto max-w-xl px-2">
            <WalletAccount className="mb-4" />
            <HomeNFTList className="mb-4" />
            <SwapBox className="mb-4" />
            <SendMoney />
          </div>
        </div>
      </div>
    </main>
  );
}
