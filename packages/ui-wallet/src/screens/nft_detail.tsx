import { NFT } from "@skiawallet/entities";
import * as _ from "lodash";
import { useLocation, useNavigate } from "react-router-dom";

interface RouterPropState {
    nft: NFT;
}

export default function NFTDetail(): JSX.Element {

    const navigate = useNavigate()
    const location = useLocation()
    const { nft } = location.state as RouterPropState


    const handlBack = () => {
        navigate(-1)
    }

    return (
        <main className="h-screen">
            <div id={nft.name} className="mt-5 h-screen flex flex-col">
                <div className="grow-0 flex-col mx-auto">
                    <div className="m-auto max-w-xl px-2">
                        <div onClick={handlBack}>Back</div>
                        <div>
                            <div>{nft.contractName}</div>
                            <div>{nft.name}</div>
                            <img src={nft.image} width={400} height={400} style={{ objectFit: 'cover' }} />
                            {nft.attributes && nft.attributes.length ? nft.attributes.map(metadata => {
                                return (
                                    <div>
                                        <div>{metadata['trait_type']}</div>
                                        <div>{metadata['value']}</div>
                                        <br></br>
                                    </div>

                                )
                            }) : null}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
