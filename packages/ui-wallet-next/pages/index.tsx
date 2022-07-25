import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRecoilValue } from 'recoil';
import WalletAccount from '../components/wallet_account';
import { stateUserWallet } from '../state/wallet';
import { UserWallet } from '../utils/wallet_entity';

export default function Home() {
  return (
    <>
      <Head>
        <title>Skia Wallet</title>
      </Head>
      <h1>Skia Wallet</h1>
      <main>
        <div className="mx-2">
          <div className="flex overflow-x-scroll pb-10">
            <div className="flex flex-nowrap ">
              <div className="inline-block px-2"></div>
            </div>
            {typeof window !== 'undefined' ? <WalletAccount /> : <></>}
            <div className="flex flex-nowrap ">
              <div className="inline-block px-3"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
