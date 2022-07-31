/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  //  useCallback,
  useEffect,
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

// const myQuery = selector({
//   key: 'MyQuery',
//   get: (stateBalanceOfAccount)=>,
// });
export default function WalletAccount(): JSX.Element {
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

  return (
    <Card title="Your Wallet">
      <div>
        <p>Your public address</p>
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
      <div>
        {/* {balanceOfAccount} */}
        {/* {balanceOfAccountSelector} */}
        Balance:{' '}
        {(() => {
          const state = balanceOfAccountLoadable.state;
          if (state === 'hasError') return <i>error connecting to your data</i>;
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
