import { Transaction } from '@skiawallet/entities'
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

    static async getTransactionsForAddress(chainId: number, address: string): Promise<Transaction[]> {
        const response = await axios.get(`${Covalent.apiAddress}/${chainId}/address/${address}/transactions_v2/`, {
            params: {
                'key': Covalent.apiKey,
            }
        })
        const items = response.data['data']['items']

        return _.map(items, transaction => {
            return {
                from: transaction.from_address,
                to: transaction.to_address,
                logEvents: transaction.log_events,
                feesPaid: parseInt(transaction.fees_paid),
                amount: parseInt(transaction.value),
                txHash: transaction.tx_hash,
            }
        })
    }
}