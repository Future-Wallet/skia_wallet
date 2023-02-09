// export interface Token {
//   name: string;
//   abbrv: string;
// }

// export type Bitcoin = Token;
// export const bitcoin: Bitcoin = {
//   name: 'bitocoin',
//   abbrv: 'btc',
// };

// export type Ether = Token;
// export const ether: Ether = {
//   name: 'ether',
//   abbrv: 'eth',
// };
// export type Avax = Token;
// export const avax: Avax = {
//   name: 'avax',
//   abbrv: 'avax',
// };

// export type Tokens = {
//   bitcoin: Bitcoin;
//   ether: Ether;
//   avax: Avax;
// };

/**
 * List of tokens that we support.
 */
// export const tokensSupported: Tokens = {
//   bitcoin,
//   ether,
//   avax,
// };



// New code


export enum Chain {
  Ethereum = 1,
  EthereumGoerli = 5
}

// export let defaultChain: Chain = Chain.Ethereum
export let defaultChain: Chain = Chain.EthereumGoerli

export type Token = {
  chainId: Chain,
  address: string,
  name: string,
  symbol: string,
  decimals: number,
  logoURI: string,
  coingeckoId: string | undefined,
}


export type UserToken = {
  token: Token,
  balance: number,
  price: number,
}