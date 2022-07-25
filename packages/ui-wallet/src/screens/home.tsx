import WalletAccount from '../components/wallet_account';

export default function Home(): JSX.Element {
  return (
    <main>
      <div className="mx-2">
        <div className="flex overflow-x-scroll pb-10">
          <div className="flex flex-nowrap ">
            <div className="inline-block px-2"></div>
          </div>
          <div className="m-auto max-w-xl min-w-max">
            <WalletAccount />
          </div>
          <div className="flex flex-nowrap ">
            <div className="inline-block px-3"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
