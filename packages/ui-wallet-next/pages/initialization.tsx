import Head from 'next/head';
import dynamic from 'next/dynamic';
import { TypeOfWalletAction } from '../components/create_wallet_action';

// Render it only on the client-side, instead of the server-side.
const CreateWalletAction = dynamic(
  () => import('../components/create_wallet_action'),
  {
    ssr: false,
  }
);

export default function Initialization() {
  return (
    <>
      <Head>
        <title>Start your wallet</title>
      </Head>
      <main>
        <div className="mt-2 mx-2">
          <div className="flex overflow-x-scroll pb-10">
            <div className="flex flex-nowrap ">
              <div className="inline-block px-2">
                {/* {typeof window !== 'undefined' ? ( */}
                <CreateWalletAction type={TypeOfWalletAction.import} />
                {/* ) : (
                  <></>
                )} */}
              </div>
            </div>
            {/* <div className="flex flex-nowrap ">
            <div className="inline-block px-3">
            <CreateWalletAction type={TypeOfWalletAction.create} />
            </div>
          </div> */}
          </div>
        </div>
      </main>
    </>
  );
}
