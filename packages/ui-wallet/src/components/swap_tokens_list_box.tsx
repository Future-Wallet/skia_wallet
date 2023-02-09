import { Swap, TokenForSwap } from '@skiawallet/repositories';
import { useEffect, useState } from 'react';
import * as _ from 'lodash'
import { defaultChain } from '@skiawallet/entities';

interface SwapTokensListBox {
  onTokenSelect: (token: TokenForSwap) => void
}

export default function SwapTokensListBox(props: SwapTokensListBox): JSX.Element {

  const [loadingTokens, setLoadingTokens] = useState<boolean>(true)
  const [tokenSearch, setTokenSearch] = useState<string>("")
  const [tokensForSwap, setTokensForSwap] = useState<TokenForSwap[]>([])
  const [tokensForSwapFiltered, setTokensForSwapFiltered] = useState<TokenForSwap[]>([])

  useEffect(() => {
    Swap.getTokensForSwap(defaultChain)
      .then(tokens => {
        setTokensForSwap(tokens)
        setTokensForSwapFiltered(tokens)
        setLoadingTokens(false)
      })

  }, [])

  useEffect(() => {
    const filtered = _.filter(
      tokensForSwap,
      x => x.name.toLowerCase().indexOf(tokenSearch.toLowerCase()) > -1
    )
    setTokensForSwapFiltered(filtered)
  }, [tokenSearch])

  return (
    <div>
      {loadingTokens ?
        <p className="mb-2">
          Loading tokens...
        </p> :
        <div>
          <div>
            <input
              onChange={e => setTokenSearch(e.target.value)}
              className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={tokenSearch}
            />
          </div>

          <div className="mt-8 mb-2" style={{ maxHeight: 300, overflow: 'scroll' }}>
            {tokensForSwapFiltered.map((token, index) => {
              return (
                <div key={index} style={{ display: 'flex' }} className="mb-4" onClick={_ => props.onTokenSelect(token)} >
                  <img src={token.logoURI} width={30} height={30} style={{ objectFit: 'cover' }}></img><span>{token.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      }
    </div>
  );
}
