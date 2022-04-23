export interface Token {
	name: string;
	abbrv: string;
}

export interface Bitcoin extends Token {}
const bitcoin: Bitcoin = {
	name: 'bitocoin',
	abbrv: 'btc',
};

export interface Ether extends Token {}
const ether: Ether = {
	name: 'ether',
	abbrv: 'eth',
};
export interface Avax extends Token {}
const avax: Avax = {
	name: 'avax',
	abbrv: 'avax',
};

export interface Tokens {
	bitcoin: Bitcoin;
	ether: Ether;
	avax: Avax;
}

/**
 * List of tokens that we support.
 */
export const tokensSupported: Tokens = {
	bitcoin,
	ether,
	avax,
};
