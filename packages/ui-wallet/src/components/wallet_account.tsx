import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { stateBalanceOfAccount, stateUserWallet } from '../state/wallet';
import Api from '../utils/api';
import { UserWallet } from '../utils/wallet_entity';
import Card from './atomic/card';

export default function WalletAccount(): JSX.Element {
  const wallet = useRecoilValue<UserWallet | null>(stateUserWallet);
  const [balanceOfAccount, setBalanceOfAccount] = useRecoilState(
    stateBalanceOfAccount
  );

  // Fetch balance of the account every some seconds.
  useEffect(() => {
    async function getBalance(): Promise<void> {
      if (wallet != null) {
        const balance = await Api.getBalance(
          wallet?.props.firstAccount.address
        );
        setBalanceOfAccount(balance);
      }
    }

    getBalance();

    // Periodic timer
    const periodicTimer = setInterval(async () => {
      await getBalance();
    }, 10000);

    return () => clearInterval(periodicTimer);
  }, [wallet, balanceOfAccount, setBalanceOfAccount]);

  function copyAddressToClipboard() {
    console.log();
  }

  return (
    <Card title="Your Wallet">
      <div>
        <p>Your public address</p>
      </div>
      <div>
        <input
          className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          value={wallet?.props.firstAccount.address}
          onClick={copyAddressToClipboard}
          placeholder={wallet?.props.firstAccount.address}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          // onClick="copyMeOnClipboard()"
        >
          Copy
        </button>
      </div>
    </Card>
  );
}
