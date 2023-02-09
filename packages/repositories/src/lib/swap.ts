import { CowSdk, OrderKind } from '@cowprotocol/cow-sdk'
import { Chain } from '@skiawallet/entities';
import axios from 'axios';
import { BigNumber, BigNumberish, Contract, ethers, Wallet } from 'ethers';
import * as _ from 'lodash';
import { MakerRegistry, Swap as SwapAirswap } from '@airswap/libraries';
const ERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json");
const GPv2SettlementArtefact = require("@gnosis.pm/gp-v2-contracts/deployments/mainnet/GPv2Settlement.json");
// const RegistryContract = require('@airswap/registry/build/contracts/Registry.sol/Registry.json');

export interface TokenForSwap {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
}

export class Swap {
    private static instance: Swap;
    wallet!: Wallet;
    cowSdk!: CowSdk;
    chainId!: number;
    cowGPV2ValueRelayer: string = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"
    airswapRegistry: string = "0x05545815a5579d80Bd4c380da3487EAC2c4Ce299" // devnet goerli 0x05545815a5579d80Bd4c380da3487EAC2c4Ce299 | mainnet 0x8F9DA6d38939411340b19401E8c54Ea1f51B8f95

    private constructor(chainId: number, wallet: Wallet) {
        this.cowSdk = new CowSdk(chainId, { signer: wallet })
        this.wallet = wallet
        this.chainId = chainId
    }

    public static get(chainId: number, wallet: Wallet): Swap {
        if (!Swap.instance) {
            Swap.instance = new Swap(chainId, wallet);
        }

        return Swap.instance;
    }

    static async swap(token1Address: string, token2Address: string, quantity: number) {
        console.log(token1Address, token2Address, quantity)
    }

    static async getTokensForSwap(chain: Chain): Promise<TokenForSwap[]> {

        const sources = [
            "https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json",
            "https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json",
            "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json",
            "https://app.tryroll.com/tokens.json",
            "https://files.cow.fi/tokens/CoinGecko.json",
            "https://files.cow.fi/tokens/CowSwap.json",
            "https://www.gemini.com/uniswap/manifest.json",
            //Dev
            'https://raw.githubusercontent.com/cowprotocol/cowswap/main/src/custom/tokens/goerli-token-list.json'
        ]

        const promises = _.map(sources, async source => {
            return axios.get(source)
                .then(response => response.data['tokens'] as any[])
                .then(tokens => _.map(tokens, (x: any): TokenForSwap => {
                    return {
                        chainId: x['chainId'] as number,
                        address: x['address'] as string,
                        name: x['name'] as string,
                        symbol: x['symbol'] as string,
                        decimals: x['decimals'] as number,
                        logoURI: x['logoURI'] as string,
                    } as TokenForSwap
                }))
                .then(tokenForSwap => _.filter(tokenForSwap, x => x.chainId == chain))
                .catch(_ => [] as TokenForSwap[])
        })

        const result: TokenForSwap[][] = await Promise.all(promises)
        const unique = _.uniqWith(
            _.flatten(result),
            (a, b) => (a.chainId != b.chainId) && (a.address != b.address)
        )
        const filteredWithLogo = _.filter(unique, x => !_.isNil(x.logoURI))
        const ordered = _.orderBy(filteredWithLogo, ['name'], ['asc'])
        //TODO: Change this when moving to production, this is just for tests because protocols don't have the same tokens, just use ordered
        const withNewName = _.map(ordered, x => {
            return {
                ...x,
                name: x.name + ' (Cowswap)',
            }
        })

        return withNewName.concat([
            {
                chainId: 5,
                address: '0x208f73527727bcb2d9ca9ba047e3979559eb08cc',
                name: 'Uniswap (Airswap)',
                symbol: 'UNI',
                decimals: 18,
                logoURI: 'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/'
            },
            {
                chainId: 5,
                address: '0x79c950c7446b234a6ad53b908fbf342b01c4d446',
                name: 'USDT (Airswap)',
                symbol: 'USDT',
                decimals: 18,
                logoURI: 'https://w7.pngwing.com/pngs/581/504/png-transparent-tether-usdt-cryptocoins-icon.png'
            }
        ])

    }

    async getQuoteAirswap(userAddress: string, amount: string, token1Address: string, token2Address: string): Promise<any> {

        // const RegistryInterface = new ethers.utils.Interface(
        //     JSON.stringify(RegistryContract.abi),
        // )

        // const contract = new ethers.Contract(
        //     this.airswapRegistry,
        //     RegistryInterface,
        //     this.wallet,
        // )
        // const baseTokenURLs = await contract['getURLsForToken'](token1Address)
        // const quoteTokenURLs = await contract['getURLsForToken'](token2Address)

        // const servers: Server[] = baseTokenURLs
        //     .filter((value: any) =>
        //         quoteTokenURLs.includes(value),
        //     )
        //     .map((value: string) => {
        //         return new Server(value)
        //     })

        const servers = await new MakerRegistry(this.chainId, this.wallet).getMakers(
            token1Address,
            token2Address,
        )

        const order = await servers[0].getSignerSideOrder(
            amount,
            token1Address,
            token2Address,
            userAddress,
        )

        return order
    }

    async swapAirswap(order: any) {
        console.log('order', order, this.chainId, this.wallet)
        const tx = await new SwapAirswap(this.chainId, this.wallet.provider).light(order)
        return tx
    }

    async getQuoteCow(userAddress: string, amount: string, token1Address: string, token2Address: string) {
        const quoteResponseSell = await this.cowSdk.cowApi.getQuote({
            kind: OrderKind.SELL,
            from: userAddress,
            sellToken: token1Address,
            buyToken: token2Address,
            sellAmountBeforeFee: amount,
            receiver: userAddress,
            validTo: parseInt(((Date.now() + (60 * 1000 * 10)) / 1000).toString()),
            appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
            partiallyFillable: false
        })

        return { quoteResponseSell }
    }

    async getAllowance(token: string, owner: string) {
        const erc20 = new Contract(token, ERC20.abi, this.wallet);
        const tx = await erc20.connect(this.wallet)['allowance'](owner, this.cowGPV2ValueRelayer);
        return BigNumber.from(tx.toString()).toBigInt()
    }

    async setAllowance(token: string) {
        const erc20 = new Contract(token, ERC20.abi, this.wallet);
        const tx = await erc20.connect(this.wallet)['approve'](this.cowGPV2ValueRelayer, ethers.constants.MaxUint256);
        await tx.wait();
    }

    async waitForOrder(orderId: string, trader: string) {
        const TRADE_TIMEOUT_SECONDS = 2 * 60
        const settlement = new Contract(this.cowGPV2ValueRelayer, GPv2SettlementArtefact.abi, this.wallet.provider)
        const traded = new Promise((resolve: (value: boolean) => void) => {
            this.wallet.provider.on(settlement.filters['Trade'](trader), (log) => {
                // Hacky way to verify that the UID is part of the event data
                console.log(log.data)
                if (log.data.includes(orderId.substring(2))) {
                    resolve(true);
                }
            });
        });


        const timeout = new Promise((resolve: (value: boolean) => void) => {
            setTimeout(resolve, TRADE_TIMEOUT_SECONDS * 1000, false);
        });

        const hasTraded = await Promise.race([traded, timeout]);
        return hasTraded
    }

    async swapCow(sellToken: string, buyToken: string, validTo: number | Date, buyAmount: BigNumberish, sellAmount: BigNumberish, receiver: string, feeAmount: BigNumberish) {

        const allowance = await this.getAllowance(sellToken, receiver)
        if (allowance <= 0) {
            console.log("Ask for allowance")
            await this.setAllowance(sellToken)
        }

        const order = {
            kind: OrderKind.SELL,
            receiver,
            sellToken,
            buyToken,
            partiallyFillable: false,
            validTo,
            sellAmount,
            buyAmount,
            feeAmount,
            appData: '0x0000000000000000000000000000000000000000000000000000000000000000',
        }

        const signedOrder = await this.cowSdk.signOrder(order)
        const orderId = await this.cowSdk.cowApi.sendOrder({
            order: { ...order, ...{ signature: signedOrder.signature!, signingScheme: signedOrder.signingScheme } },
            owner: receiver,
        })

        console.log(`https://explorer.cow.fi/rinkeby/orders/${orderId}`)

        await this.waitForOrder(orderId, receiver)
        console.log("Orden fullfilled")


    }

}