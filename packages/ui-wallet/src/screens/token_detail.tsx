import { AccountOfWallet, Chain, Transaction, UserToken, UserWallet } from "@skiawallet/entities";
import { Covalent } from "@skiawallet/repositories";
import * as _ from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import TransactionHistoryRow from "../components/atomic/transaction_history";
import { stateUserWallet } from "../state/wallet/wallet";

interface RouterPropState {
    token: UserToken;
}

export default function TokenDetail(): JSX.Element {

    const navigate = useNavigate()
    const location = useLocation()
    const { token } = location.state as RouterPropState
    const wallet = useRecoilValue<UserWallet | null>(stateUserWallet);

    const [transactions, setTransactions] = useState<Transaction[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)


    const handlBack = () => {
        navigate(-1)
    }

    useEffect(() => {

        console.log('token', token)

        const activeAccount = _.find(wallet?.accounts, (account: AccountOfWallet) => account.active)
        if (activeAccount) {
            Covalent.getTransactionsForAddress(
                Chain.Ethereum,
                activeAccount.publicAddress.value
            ).then((covalentTransactions: Transaction[]) => {

                const filtered: Transaction[] = _.filter(covalentTransactions, transaction => {

                    const noLogEvents = transaction.logEvents.length == 0

                    const hasMyAddressInTransfer = _.find(transaction.logEvents, logEvent => {

                        const hasTransfer = _.find(logEvent.decoded || [], decodedData => {
                            const isTransfer = decodedData.name == 'Transfer'
                            const decodedParams = decodedData.params || []
                            const myAddressIsPresent = _.find(decodedParams, param => {
                                return param.value == activeAccount.publicAddress.value
                            })

                            return isTransfer && myAddressIsPresent != undefined
                        })

                        return !_.isUndefined(hasTransfer)

                    })
                    return noLogEvents || !_.isUndefined(hasMyAddressInTransfer)
                })

                setTransactions(filtered)
                setIsLoading(false)
            })
        }

    }, [])


    return (
        <main className="h-screen">
            <div id={TokenDetail.name} className="mt-5 h-screen flex flex-col">
                <div className="grow-0 flex-col mx-auto">
                    <div className="m-auto max-w-xl px-2">
                        <div onClick={handlBack}>Back</div>
                        <div>
                            {isLoading ? <div>Loading...</div> : null}
                            {transactions.map(transaction => {
                                return (
                                    <TransactionHistoryRow
                                        key={transaction.txHash}
                                        token={token}
                                        transaction={transaction}
                                    ></TransactionHistoryRow>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
