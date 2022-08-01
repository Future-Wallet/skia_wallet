/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ReactNode,
  //  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  // selector,
  useRecoilRefresher_UNSTABLE,
  // useRecoilState,
  // useRecoilTransaction_UNSTABLE,
  // useRecoilValueLoadable,
  useRecoilValue,
  useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE,
} from 'recoil';
import { usePrevious } from '../state/utils';

import {
  // stateBalanceOfAccount,
  stateSelectorBalanceOfAccount,
  stateUserWallet,
} from '../state/wallet';
// import Api from '../utils/api';
import { UserWallet } from '../utils/wallet_entity';
import Card from './atomic/card';
import IconButton from './atomic/icon_button';
import Modal from './atomic/modal';
import Settings from './settings';

// const myQuery = selector({
//   key: 'MyQuery',
//   get: (stateBalanceOfAccount)=>,
// });
export default function WalletAccount(): JSX.Element {
  const [showSettings, setShowSettings] = useState(false);
  const wallet = useRecoilValue<UserWallet | null>(stateUserWallet);
  // const walletLoadable = useRecoilValueLoadable<UserWallet | null>(
  //   stateUserWallet
  // );
  // const wallet = useRecoilValue<UserWallet | null>(stateUserWallet);

  // const [balanceOfAccount, setBalanceOfAccount] = useRecoilState(
  //   stateBalanceOfAccount
  // );
  const refresh = useRecoilRefresher_UNSTABLE(stateSelectorBalanceOfAccount);
  const previousBalanceOfAccount = usePrevious(stateSelectorBalanceOfAccount);
  const balanceOfAccountLoadable =
    useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE<string | null>(
      stateSelectorBalanceOfAccount
    );
  // const balanceOfAccountSelector = useRecoilValue<string | null>(
  //   stateSelectorBalanceOfAccount
  // );
  // const balanceOfAccount = useRecoilValue<string | null>(stateBalanceOfAccount);

  // const getBalance = useCallback(async () => {
  //   if (wallet != null) {
  //     const balance = await Api.getBalance(wallet?.props.firstAccount.address);
  //     setBalanceOfAccount(balance);
  //   }
  // }, [wallet, setBalanceOfAccount]);

  // useEffect(() => {
  //   getBalance();
  // }, [getBalance]);

  useEffect(() => {
    refresh();

    // Periodic timer
    const periodicTimer = setInterval(() => {
      // balanceOfAccountLoadable.getValue();
      refresh();
    }, 10000);

    return () => clearInterval(periodicTimer);
  }, [refresh]);

  // useRecoilTransaction_UNSTABLE(
  //   ({ set }) =>
  //     () => {
  //       if (walletLoadable.state !== 'hasValue') return;

  //       if (walletLoadable.contents != null) {
  //         const { props } = walletLoadable.contents;
  //         const balance = Api.getBalance(props.firstAccount.address);
  //       }

  //       set(stateBalanceOfAccount)
  //     },
  //   [walletLoadable]
  // );

  // Fetch balance of the account every some seconds.
  // useEffect(() => {
  //   async function getBalance(): Promise<void> {
  //     if (wallet != null) {
  //       const balance = await Api.getBalance(
  //         wallet?.props.firstAccount.address
  //       );
  //       console.log(balance);
  //       // setBalanceOfAccount(balance);
  //     }
  //   }

  //   getBalance();

  //   // return () => {
  //   //   getBalance();
  //   // };
  // }, []);

  // useEffect(() => {
  //   // https://beta.reactjs.org/learn/synchronizing-with-effects#fetching-data
  //   let ignore = false;

  //   async function getBalance() {
  //     if (wallet != null) {
  //       const balance = await Api.getBalance(
  //         wallet?.props.firstAccount.address
  //       );
  //       if (!ignore) {
  //         // console.log(balance);
  //         setBalanceOfAccount(balance);
  //       }
  //     }
  //   }

  //   // Periodic timer
  //   const periodicTimer = setInterval(async () => {
  //     await getBalance();
  //   }, 10000);

  //   return () => {
  //     clearInterval(periodicTimer);
  //     ignore = true;
  //   };
  // }, [wallet, setBalanceOfAccount]);

  function copyAddressToClipboard() {
    console.log();
  }

  function buttonSettings(): ReactNode {
    return (
      <IconButton
        className="rounded"
        data-modal-toggle="settings-modal"
        onClick={() => setShowSettings((value) => !value)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </IconButton>
    );
  }

  return (
    <>
      <Card title="Your Wallet" actions={[buttonSettings()]}>
        <div>
          <p>Your public address that can be shared with others</p>
        </div>
        <div className="flex flex-1">
          <input
            className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
            type="text"
            readOnly
            value={wallet?.props.accounts[0].props.publicAddress}
            onClick={copyAddressToClipboard}
            placeholder={wallet?.props.accounts[0].props.publicAddress}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            // onClick="copyMeOnClipboard()"
          >
            Copy
          </button>
        </div>
        <div className="mt-5">
          {/* {balanceOfAccount} */}
          {/* {balanceOfAccountSelector} */}
          Balance:{' '}
          {(() => {
            const state = balanceOfAccountLoadable.state;
            if (state === 'hasError')
              return <i>error connecting to your data</i>;
            else if (previousBalanceOfAccount === undefined) return '...';
            else if (state === 'loading') return `${previousBalanceOfAccount}`;
            else return `${balanceOfAccountLoadable.contents}`;
          })()}
          {/* {previousBalanceOfAccount === undefined ? (
          '...'
          ) : balanceOfAccountLoadable.state !== 'loading' ? (
            previousBalanceOfAccount === balanceOfAccountLoadable.contents ? (
              `${balanceOfAccountLoadable.contents} AVAX`
              ) : (
                '...'
                )
                ) : (
                  <i>(error connecting to your data)</i>
                )} */}
        </div>
      </Card>
      {showSettings ? (
        <Modal id="settings-modal---" onClose={() => setShowSettings(false)}>
          {/* // eslint-disable-next-line @typescript-eslint/no-empty-function
        // <Modal id="settings-modal" onClose={() => {}}> */}
          <Settings />
        </Modal>
      ) : null}
    </>
  );
}

// function Balance(): JSX.Element {
//   const wallet = useRecoilValue<UserWallet | null>(stateUserWallet);
//   const [balanceOfAccount, setBalanceOfAccount] = useRecoilState(
//     stateBalanceOfAccount
//   );

//   // Fetch balance of the account every some seconds.
//   useEffect(() => {
//     const timeInterval =
//       process.env['NODE_ENV'] !== 'production' ? 10000 : 5000;

//     async function getBalance(): Promise<void> {
//       if (wallet != null) {
//         const balance = await Api.getBalance(
//           wallet?.props.firstAccount.address
//         );
//         setBalanceOfAccount(balance);
//       }
//     }

//     getBalance();

//     // Periodic timer
//     const periodicTimer = setInterval(async () => {
//       await getBalance();
//     }, timeInterval);

//     return () => clearInterval(periodicTimer);
//   }, [wallet, balanceOfAccount, setBalanceOfAccount]);

//   return <div>{balanceOfAccount} AVAX</div>;
// }
