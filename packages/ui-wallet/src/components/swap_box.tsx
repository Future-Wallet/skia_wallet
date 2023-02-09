import { defaultChain, UserWallet } from '@skiawallet/entities';
import { Swap, TokenForSwap } from '@skiawallet/repositories';
import * as _ from 'lodash';
import { useEffect, useState, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { stateUserWallet } from '../state/wallet/wallet';
import Button from './atomic/button';
import Card from './atomic/card';
import Modal from './atomic/modal';
import SwapTokensListBox from './swap_tokens_list_box';

type SwapProps = {
    className?: string;
};

enum TokenType {
    Input,
    Output
}

export default function SwapBox({ className }: SwapProps): JSX.Element {

    const [swapping, setSwapping] = useState(false)
    const [showTokenList, setShowTokenList] = useState(false)
    const [tokenAmount, setTokenAmount] = useState(0)
    const [tokenOutputAmount, setTokenOutputAmount] = useState(0)
    const [tokenTypeSelect, setTokenTypeSelect] = useState<TokenType>(TokenType.Input)
    const [tokenInput, setTokenInput] = useState<TokenForSwap | null>(null)
    const [tokenOutput, setTokenOutput] = useState<TokenForSwap | null>(null)
    const [fee, setFee] = useState<number>(0)
    const [feeSymbol, setFeeSymbol] = useState<string>('')

    const [swapInstance, setSwapInstance] = useState<Swap | null>(null)
    const wallet = useRecoilValue<UserWallet | null>(stateUserWallet);

    useEffect(() => {
        setSwapInstance(Swap.get(defaultChain, wallet!.activeAccount!.getSigner()))
        // console.log('swap', swap)
        setSwapping
        setTokenAmount
        setShowTokenList

        //TEst
        // setTimeout(() => {
        // console.log('swapInstance', Swap.get(defaultChain, wallet!.activeAccount!.getSigner()))
        // Swap.get(defaultChain, wallet!.activeAccount!.getSigner())?.getQuote(
        //     wallet!.activeAccount!.publicAddress.value.toString(),
        //     '100000000',
        //     '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
        //     '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'
        // )
        // console.log("??????")
        // }, 5000)
    }, [])

    const requestQuote = async (tokenAmount: number, swapInstance: Swap, tokenInput: TokenForSwap, tokenOutput: TokenForSwap, wallet: UserWallet) => {
        console.log("calling getQuote...", tokenAmount, swapInstance)
        if (tokenAmount > 0) {


            const order = await swapInstance.getQuoteAirswap(
                wallet.activeAccount!.publicAddress.value.toString(),
                BigInt(tokenAmount * Math.pow(10, tokenInput!.decimals)).toString(),
                // BigInt(tokenAmount * Math.pow(10, 6)).toString(),
                // '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
                // '0x79c950c7446b234a6ad53b908fbf342b01c4d446'
                tokenInput!.address,
                tokenOutput!.address
            )

            console.log('order', order)

            const tx = await swapInstance.swapAirswap(order)
            console.log('tx', tx)

            return

            swapInstance.getQuoteCow(
                wallet.activeAccount!.publicAddress.value.toString(),
                BigInt(tokenAmount * Math.pow(10, tokenInput!.decimals)).toString(),
                tokenInput!.address,
                tokenOutput!.address
            ).then(quote => {
                const { sellToken, buyToken, validTo, buyAmount, sellAmount, receiver, feeAmount } = quote.quoteResponseSell.quote
                console.log('sellToken', sellToken)
                console.log('buyToken', buyToken)
                console.log('validTo', validTo)
                console.log('buyAmount', buyAmount)
                console.log('sellAmount', sellAmount)
                console.log('receiver', receiver)
                console.log('feeAmount', feeAmount)

                const outputAmount = parseInt(buyAmount) / Math.pow(10, tokenOutput.decimals)
                const fee = parseInt(feeAmount) / Math.pow(10, tokenOutput.decimals)

                setTokenOutputAmount(parseFloat((outputAmount - fee).toString()))
                setFee(fee)
                if (tokenInput.symbol.toUpperCase() == 'ETH') {
                    //Adds gas
                    setFeeSymbol(tokenOutput.symbol + ' + gas')
                } else {

                    setFeeSymbol(tokenOutput.symbol)
                }

                setTimeout(() => {
                    swapInstance.swapCow(sellToken, buyToken, parseInt(validTo), buyAmount, sellAmount, receiver!, feeAmount)
                }, 2000)

                // sellToken: string, buyToken: string, sellAmount: BigNumberish, buyAmount: BigNumberish, feeAmount: BigNumberish
            })
        }
    }

    const getQuote = useCallback(_.debounce(requestQuote, 500), [])

    // useEffect(() => {
    //     return () => {
    //         getQuote.cancel();
    //     }
    // }, []);

    const handleSwap = () => {

    }

    const onKeyUp = () => {
        getQuote(tokenAmount, swapInstance!, tokenInput!, tokenOutput!, wallet!)
        // console.log(getQuote)
    }

    const onClickToken = (tokenType: TokenType) => {
        setTokenTypeSelect(tokenType)
        setShowTokenList(true)
    }

    const onTokenSelectHandle = (tokenForSwap: TokenForSwap) => {
        switch (tokenTypeSelect) {
            case TokenType.Input:
                setTokenInput(tokenForSwap)
                break
            case TokenType.Output:
                setTokenOutput(tokenForSwap)
                break
        }
        setShowTokenList(false)
    }

    return (
        <div className={className}>
            <Card title="Swap">
                <div>
                    <label className="block mb-2 text-gray-900">
                        Select pair of tokens to swap
                    </label>
                </div>

                <div>
                    <div className='bg-gray-600 text-white'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div onClick={_ => onClickToken(TokenType.Input)}>{tokenInput ? tokenInput.symbol : '-'}</div>
                            <input
                                onChange={e => setTokenAmount(parseFloat(e.target.value))}
                                onKeyUp={onKeyUp}

                                className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5"
                                value={tokenAmount}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                Balance xxx
                            </div>
                            <div>
                                0
                            </div>
                        </div>
                    </div>
                    <div className="text-center">Arrow</div>
                    <div className='bg-gray-600 text-white'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div onClick={_ => onClickToken(TokenType.Output)}>{tokenOutput ? tokenOutput.symbol : '-'}</div>
                            <div>
                                {tokenOutputAmount}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                Balance xxx
                            </div>
                            <div>
                                0
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            Fees
                        </div>
                        <div>
                            {fee} {feeSymbol}
                        </div>
                    </div>
                </div>
                <div>
                    <Button
                        loading={swapping}
                        onClick={handleSwap}
                        disabled={tokenAmount == 0}
                    >
                        {!swapping ? 'Swap' : 'Swapping...'}
                    </Button>
                </div>

            </Card >
            {
                showTokenList ? (
                    <Modal title="Tokens" onClose={() => setShowTokenList(false)
                    }>
                        <SwapTokensListBox onTokenSelect={onTokenSelectHandle} />
                    </Modal >
                ) : null}
        </div >
    );
}
