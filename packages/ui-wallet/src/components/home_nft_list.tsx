// import { useRecoilValue } from 'recoil';

// import {
//     stateUserWallet,
// } from '../state/wallet/wallet';
import { defaultChain, NFT, UserWallet } from '@skiawallet/entities';
import { Covalent } from '@skiawallet/repositories';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { stateUserWallet } from '../state/wallet/wallet';
import { routes } from '../utils/routes';
import Card from './atomic/card';

type HomeNFTListProps = {
    className?: string;
};

export default function HomeNFTList({ className }: HomeNFTListProps): JSX.Element {

    const navigate = useNavigate()
    const wallet = useRecoilValue<UserWallet | null>(stateUserWallet);
    const getUserNFTs = useCallback(() => (address: string) => Covalent.getNFTs(defaultChain, address), [])
    const [nfts, setNfts] = useState<NFT[]>([])

    useEffect(() => {
        getUserNFTs()(wallet!.activeAccount!.publicAddress.value)
            .then(result => {
                setNfts(result)
            })
    }, [])

    const handleClickNFT = (nft: NFT) => {
        navigate(`/${routes.nftDetail}`, {
            state: {
                nft
            }
        });
    }

    return (
        <div className={className}>
            <Card title="NFTs">
                <div>
                    <label className="block mb-2 text-gray-900">
                        List of my NFTs
                    </label>
                </div>
                {nfts.map((nft, index) => {
                    return (
                        <div key={index} style={{ width: 100, height: 150 }} onClick={() => handleClickNFT(nft)}>
                            <img src={nft.image} width={100} height={100} style={{ objectFit: 'cover' }} />
                            <div style={{ fontSize: 11 }}>{nft.contractName} #{nft.name}</div>
                        </div>
                    )
                })}
            </Card>
        </div>
    );
}
