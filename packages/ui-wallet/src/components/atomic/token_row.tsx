import { FC, HTMLProps } from 'react';
interface TokenProps extends HTMLProps<HTMLDivElement> {
    logoURI: string;
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    balance?: number;
    price?: number;
}

const TokenRow: FC<TokenProps> = ({ logoURI, name, symbol, balance, decimals, price }) => {
    return (

        <div className='flex' style={{ marginBottom: 10 }}>
            <img className='object-cover' style={{ width: 30, height: 30 }} src={logoURI} />
            <div className='flex flex-col'>
                <div>{name}</div>
                <div>{symbol}</div>
            </div>
            <div className='flex flex-col' style={{ textAlign: 'right' }}>
                {balance ? <div>Balance: {balance / Math.pow(10, decimals)}</div> : null}
                {price ? <div>Price: {price}</div> : null}
            </div>
        </div>

    );
    /* </div> */
    // </div>
};
export default TokenRow;
