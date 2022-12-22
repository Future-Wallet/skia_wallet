import { Token } from '@skiawallet/entities'
import axios from 'axios'
import _ from 'lodash'

export enum Network {
    Ethereum = 'ethereum',
    Polygon = 'polygon',
    Avalanche = 'avalanche',
}

// 'USDT,USDC,BUSD,SHIB,UNI'
const DEFAULT_TOKEN_LIST = '0xdac17f958d2ee523a2206206994597c13d831ec7,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,0x4fabb145d64652a948d72533023f6e7a623c7c53,0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce,0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
export const getDefaultTokenList = (): { [key: string]: boolean } => {
    const tokens = DEFAULT_TOKEN_LIST.split(',')
    return _.reduce(
        tokens, (acc: object, token: string) => {
            return _.assign(acc, { [token]: true })
        }, {})
}

export const getAllTokenList = async (network: Network): Promise<Token[]> => {
    const requests = await Promise.all([
        axios.get(`https://tokens.coingecko.com/${network}/all.json`),
        axios.get(`https://api.coingecko.com/api/v3/coins/list?include_platform=true`)
    ])

    const [tokensData, idsData]: [any, any] = requests
    const onlyForNetwork = _.filter(idsData.data, x => !_.isUndefined(x['platforms'][network]))
    const idsByAddress: any = _.reduce(
        onlyForNetwork,
        (acc: object, token: any) => {
            const tokenAddress = token['platforms'][network]
            return _.assign(acc, { [tokenAddress]: token['id'] })
        },
        {}
    )

    return _.map(tokensData.data['tokens'], token => {
        const coingeckoId = idsByAddress[token['address']]
        return { ...token, coingeckoId }
    })

}

export const getTokenPrice = async (coingeckoId: string) => {
    const URL = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=USD`
    const response = await axios.get(URL)
    const data = response.data
    if (response.status == 200) {
        if (data[coingeckoId]) {
            return data[coingeckoId]['usd']
        } else {
            return null
        }
    } else return null

}