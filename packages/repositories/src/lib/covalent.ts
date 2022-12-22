import axios from 'axios'
import * as _ from 'lodash'
export class Covalent {

    //TODO: Move to .env
    private static apiKey = 'ckey_566313d9428b44bf9ac6410d6ac'
    private static apiAddress = 'https://api.covalenthq.com/v1'

    static async getTokensForAddress(chainId: number, address: string) {

        const response = await axios.get(`${Covalent.apiAddress}/${chainId}/address/${address}/balances_v2/`, {
            params: {
                'quote-currency': 'USD',
                'format': 'JSON',
                'nft': false,
                'no-nft-fetch': true,
                'key': Covalent.apiKey,
            }
        })

        const items = response.data['data']['items']

        return _.map(items, item => {
            return {
                token: {
                    chainId,
                    address: item.contract_address,
                    name: item.contract_name,
                    symbol: item.contract_ticker_symbol,
                    decimals: item.contract_decimals,
                    logoURI: item.logo_url,
                    coingeckoId: undefined
                },
                balance: parseInt(item.balance),
                price: parseInt(item.quote_rate),
            }
        })
    }
}