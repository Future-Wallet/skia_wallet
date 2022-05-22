export interface Token {
  name: string;
  abbrv: string;
}

export type Bitcoin = Token;
export const bitcoin: Bitcoin = {
  name: 'bitocoin',
  abbrv: 'btc',
};

export type Ether = Token;
export const ether: Ether = {
  name: 'ether',
  abbrv: 'eth',
};
export type Avax = Token;
export const avax: Avax = {
  name: 'avax',
  abbrv: 'avax',
};

export type Tokens = {
  bitcoin: Bitcoin;
  ether: Ether;
  avax: Avax;
};

/**
 * List of tokens that we support.
 */
export const tokensSupported: Tokens = {
  bitcoin,
  ether,
  avax,
};
