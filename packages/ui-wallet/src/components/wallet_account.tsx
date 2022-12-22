import { Chain, Token, UserToken, UserWallet } from '@skiawallet/entities';
import * as _ from 'lodash';
import { ReactNode, FC, useEffect, useState, useMemo, useCallback } from 'react';
import {
  // useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  // useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE,
} from 'recoil';

import {
  // stateSelectorBalanceOfAccount,
  stateUserWallet,
} from '../state/wallet/wallet';
import { copyValueToClipboard } from '../utils/miscellaneous';
import { getDefaultTokenList, getAllTokenList, Network, getTokenPrice } from '../utils/tokens';
import Button from './atomic/button';
import Card from './atomic/card';
import IconButton from './atomic/icon_button';
import Modal from './atomic/modal';
import Settings from './settings';
import { Covalent } from '@skiawallet/repositories'
import TokenRow from './atomic/token_row';
import { useNavigate } from 'react-router-dom';
import { routes } from '../utils/routes';

type WalletAccountProps = {
  className?: string;
};

const WalletAccount: FC<WalletAccountProps> = ({ className }) => {
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false);
  const wallet = useRecoilValue<UserWallet | null>(stateUserWallet);
  const [defaultTokens, setDefaultTokens] = useState<UserToken[]>([]);
  const [, setUserTokens] = useState<UserToken[]>([]);
  const [firstTenUserTokens, setFirstTenUserTokens] = useState<UserToken[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true)


  const getTokens = async () => {
    try {
      const defaultTokenList = getDefaultTokenList()
      const allTokenList = await getAllTokenList(Network.Ethereum)
      return _.filter(
        allTokenList, (token: Token) => defaultTokenList[token.address] == true)
    } catch (e) {
      return []
    }
  }
  const getDefaultTokens = useMemo(() => getTokens(), [])

  const getUserTokens = useCallback(() => (address: string) => Covalent.getTokensForAddress(Chain.Ethereum, address), [])

  // const refresh = useRecoilRefresher_UNSTABLE(stateSelectorBalanceOfAccount);

  // const balanceOfAccountLoadable =
  //   useRecoilValueLoadable_TRANSITION_SUPPORT_UNSTABLE<string | null>(
  //     stateSelectorBalanceOfAccount
  //   );

  // useEffect(() => {
  //   refresh();

  //   // Periodic timer
  //   const periodicTimer = setInterval(() => {
  //     refresh();
  //   }, 10000);

  //   return () => clearInterval(periodicTimer);
  // }, [refresh]);

  useEffect(() => {
    // console.log('sdsds')
    Promise.all([
      getDefaultTokens,
      getUserTokens()(wallet?.accounts[0].publicAddress.value || '')
    ]).then(result => {

      const [defaultList, userTokens] = result

      setUserTokens(userTokens)

      const firstTenUserTokens = _.slice(
        _.orderBy(userTokens, ['balance'], ['asc']),
        0, 10)

      const defaultTokensForUser = _.filter(
        defaultList,
        token => _.find(
          firstTenUserTokens,
          tokenUser => tokenUser.token.address == token.address
        ) == undefined
      )
      Promise.all(
        _.map(defaultTokensForUser, token => getTokenPrice(token.coingeckoId!))
      ).then(defaultTokenPrices => {
        const defaultTokensUser: UserToken[] = _.map(
          defaultTokensForUser,
          (token, index) => {
            const price = defaultTokenPrices[index]
            return {
              token: token,
              balance: 0,
              price: price ? parseFloat(price) : 0
            }
          }
        )
        setDefaultTokens(defaultTokensUser)
        setFirstTenUserTokens(firstTenUserTokens)
        setIsLoading(false)
      }).catch(error => {
        console.log('handle error', error)
      })

    })

  }, [])

  async function copyPublicAddressToClipboard() {
    if (wallet !== null && wallet.accounts[0] !== undefined) {
      await copyValueToClipboard(wallet.accounts[0].publicAddress.value);
    }
  }

  function buttonSettings(): ReactNode {
    return (
      <IconButton
        key="settings"
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

  const handleClickToken = (token: UserToken) => {
    console.log('token', token)
    navigate(`/${routes.tokenDetail}`, {
      state: {
        token
      }
    });
  }

  return (
    <div className={className}>
      <Card title="Your Wallet" actions={[buttonSettings()]}>
        <div>
          <p>Your public address that can be shared with others</p>
        </div>
        <input
          className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
          type="text"
          readOnly
          value={wallet?.accounts[0].publicAddress.value}
          onClick={() => copyPublicAddressToClipboard()}
          placeholder={wallet?.accounts[0].publicAddress.value}
        />
        <Button onClick={() => copyPublicAddressToClipboard()}>
          Copy address
        </Button>
        {/* <div className="mt-5"> */}
        {/* {balanceOfAccount} */}
        {/* {balanceOfAccountSelector} */}
        {/* Balance:{' '}
          {(() => {
            const state = balanceOfAccountLoadable.state;
            if (state === 'hasError')
              return <i>error connecting to your data</i>;
            // else if (previousBalanceOfAccount === undefined) return '...';
            else if (state === 'loading')
              // return `${previousBalanceOfAccount} AVAX`;
              return `...`;
            else return `${balanceOfAccountLoadable.contents} ETH`;
          })()} */}

        {/* </div> */}
        {isLoading ? <div>Loading...</div> : null}
        {firstTenUserTokens.map(token => (
          <TokenRow
            onClick={() => handleClickToken(token)}
            key={token.token.address}
            logoURI={token.token.logoURI}
            address={token.token.address}
            symbol={token.token.symbol}
            decimals={token.token.decimals}
            name={token.token.name}
            balance={token.balance}
            price={token.price}
          ></TokenRow>

        ))}
        {defaultTokens.map(token => (
          <TokenRow
            onClick={() => handleClickToken(token)}
            key={token.token.address}
            logoURI={token.token.logoURI}
            address={token.token.address}
            symbol={token.token.symbol}
            decimals={token.token.decimals}
            name={token.token.name}
            balance={token.balance}
            price={token.price}
          ></TokenRow>
        ))}
      </Card>
      {showSettings ? (
        <Modal title="Settings" onClose={() => setShowSettings(false)}>
          <Settings />
        </Modal>
      ) : null}
    </div>
  );
};

export default WalletAccount;

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
