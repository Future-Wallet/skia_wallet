import { Transaction, UserToken } from '@skiawallet/entities';
import { FC, HTMLProps } from 'react';
interface TransactionHistoryRowProps extends HTMLProps<HTMLDivElement> {
    transaction: Transaction,
    token: UserToken
}

const TransactionHistoryRow: FC<TransactionHistoryRowProps> = ({ transaction, token }) => {
    return (

        <div className='flex' style={{ marginBottom: 10 }}>
            <img className='object-cover' style={{ width: 30, height: 30 }} />
            <div className='flex flex-col'>
                <a target={'_blank'} href={`https://etherscan.io/tx/${transaction.txHash}`}><div>tx: {transaction.txHash}</div></a>
                <div>from: {transaction.from}</div>
                <div>to: {transaction.to}</div>
                <div>fees: {transaction.feesPaid / Math.pow(10, token.token.decimals)}</div>
                <div>amount: {transaction.amount / Math.pow(10, token.token.decimals)}</div>
            </div>
            {/* <div className='flex flex-col flex-1' style={{ textAlign: 'right' }}>
                {balance ? <div>Balance: {balance / Math.pow(10, decimals)}</div> : null}
                {price ? <div>Price: ${price}</div> : null}
            </div> */}
        </div>

    );
    /* </div> */
    // </div>
};
export default TransactionHistoryRow;
