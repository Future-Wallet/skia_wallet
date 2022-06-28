import type { NextPage } from 'next'
import Head from 'next/head'
import * as bip39 from 'bip39'
import { utils, Wallet } from 'ethers'
import { useEffect, useState } from 'react'
import * as ethers from 'ethers'
import AnkrscanProvider from '@ankr.com/ankr.js'
import { fetchTokens } from '@airswap/metadata'
import { Server, Swap, Registry } from '@airswap/libraries'
import { swapAbi } from '../hooks/airswapAbi'
import { axelarGatewayAbi } from '../hooks/AxelarGatewayAbi'
import { registryAbi } from '../hooks/airRegistryAbi'
import { converterAbi } from '../hooks/airconverterAbi'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  TemplateIcon,
  IdentificationIcon,
  BookmarkAltIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  LogoutIcon,
  ChevronDownIcon,
  SearchIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/outline'
import {
  ViewGridIcon,
  MailIcon,
  ShoppingCartIcon,
  LightningBoltIcon,
  ShoppingBagIcon,
  HomeIcon,
  BellIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
} from '@heroicons/react/solid'
import { abi } from '../hooks/abiERC20'
import { ThresholdError } from 'avalanche/dist/utils'


const Home: NextPage = () => {
  // State of page components to render
  const [showThis, setShowThis] = useState(false)
  // We set state to store the balance
  const [balance, setBalance] = useState<any>()
  const [nfts, setNfts] = useState<Array<{ tokenId: string; image: string }>>(
    []
  )
  const [formInput, updateFormInput] = useState({ account2: '', amount: '' })
  const [formInput2, updateFormInput2] = useState({
    token: '',
    amountCross: '',
    sendChain: ''
  })
  const [formInput3, updateFormInput3] = useState({
    token: '',
    token2: '',
    swapAmount: ''
  })

  // We set state of the variables we are storing
  const [mnemonicOfUser, setMnemonicOfUser] = useState<any>(null)
  const [addressOfUser, setaddressOfUser] = useState<any>(null)
  const [seedOfUser, setSeedOfUser] = useState<any>(null)
  const [privateKeyOfUser, setPrivateKeyOfUser] = useState<any>(null)
  const [privateKeyOfUser0x, setPrivateKeyOfUser0x] = useState<any>(null)
  const [walletOfUser, setWalletOfUser] = useState<any>(null)
  const [passwordInput, updatePasswordInput] = useState<any>(null)

  const generateMyMnemonic = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      //`https://kovan.infura.io/v3/${INFURA_ID}`
      'https://rpc.ankr.com/avalanche_fuji'
      // 'https://quickapi.com/'
    )
    // We generate a random mnemonic with BIP39
    const mnemonic = bip39.generateMnemonic()
    console.log('mnemonic:', mnemonic)
    const seedBuffer = bip39.mnemonicToSeedSync(mnemonic, passwordInput)
    console.log('Seed Buffer:', seedBuffer)
    const seed = bip39
      .mnemonicToSeedSync(mnemonic, passwordInput)
      .toString('hex')
    // We sincronize the Mnemonic to be EVM compatible
    const hdNode = utils.HDNode.fromSeed(Buffer.from(seed, 'hex'))
    console.log('Seed hexed:', seed)
    // const avaxndNode = new hdnode(seedBuffer)
    console.log('hdnNde:', hdNode)
    // console.log('AvaxndNode:', avaxndNode)
    // We retrieve the package data of the FIRST account -- DON'T USE DIRECTLY AS ADDRESS
    const firstAccount = hdNode.derivePath(`m/44'/60'/0'/0/0`) // This returns a first account of wallet
    console.log('firstAccount:', firstAccount)
    // We retrieve the package data of the SECOND account -- DON'T USE DIRECTLY AS ADDRESS
    const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`)
    console.log('secondAccount:', secondAccount)
    // More addresses can be fetched by this method
    // const thirdAccount = hdNode.derivePath(`m/44'/60'/0'/0/2`)
    // console.log('thirdAccount:', thirdAccount)
    // Setting state to store the variables as string
    setMnemonicOfUser(mnemonic)
    setSeedOfUser(seed)
    setPrivateKeyOfUser0x(firstAccount.privateKey)
    setPrivateKeyOfUser(firstAccount.privateKey.substring(2))
    setaddressOfUser(firstAccount.address)
    setWalletOfUser(firstAccount)

    const senderBalanceBefore = await provider.getBalance(firstAccount.address)
    // We get the _hex value and we parse into a number
    // We get the _hex value and we parse into a number
    const yourNumber = parseInt(senderBalanceBefore._hex, 16) / 10 ** 18
    // We set the balance in a state
    setBalance(yourNumber)
    // We connect to the Ankr API setting a provider, if set to none it will take all chains as input
  }

  // We set a state to store the mnemonic that user imports
  const [mnemonicInput, updateMnemonicInput] = useState('')

  const inputMnemonic = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      //`https://kovan.infura.io/v3/${INFURA_ID}`
      'https://rpc.ankr.com/avalanche_fuji'
      // 'https://quickapi.com/'
    )
    // We decrypt the Mnemonic information to hex seed
    const seedBuffer = bip39.mnemonicToSeedSync(mnemonicInput, passwordInput)
    const seed = bip39
      .mnemonicToSeedSync(mnemonicInput, passwordInput)
      .toString('hex')
    console.log('Seed:', seedBuffer)
    // We sincronize the Mnemonic to be EVM compatible
    const hdNode = utils.HDNode.fromSeed(Buffer.from(seed, 'hex'))
    console.log('hdnNde:', hdNode)
    // We retrieve the package data of the FIRST account -- DON'T USE DIRECTLY AS ADDRESS
    const firstAccount = hdNode.derivePath(`m/44'/60'/0'/0/0`) // This returns a new HDNode
    console.log('firstAccount:', firstAccount)
    // We retrieve the package data of the SECOND account -- DON'T USE DIRECTLY AS ADDRESS
    const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`) // This returns a new HDNode
    console.log('secondAccount:', secondAccount)
    // More addresses can be fetched by this method
    // const thirdAccount = hdNode.derivePath(`m/44'/60'/0'/0/2`)
    // console.log('thirdAccount:', thirdAccount)
    // Setting state to store the variables as string
    setMnemonicOfUser(mnemonicInput)
    setSeedOfUser(seed)
    setPrivateKeyOfUser0x(firstAccount.privateKey)
    setPrivateKeyOfUser(firstAccount.privateKey.substring(2))
    setaddressOfUser(firstAccount.address)

    const senderBalanceBefore = await provider.getBalance(firstAccount.address)
    // We get the _hex value and we parse into a number
    const yourNumber = parseInt(senderBalanceBefore._hex, 16) / 10 ** 18
    // We set the balance in a state
    setBalance(yourNumber)
  }


  
  const fetchNfts = async () => {
    // We connect to the Ankr API setting a provider, if set to none it will take all chains as input
    const provider2 = new AnkrscanProvider('')
    console.log('Prvodier NFTs:', provider2)

    // We call the getNFTsByOwner method of the Ankr API
    const data = await provider2.getNFTsByOwner({
      blockchain: 'eth',
      walletAddress: addressOfUser,
      filter: [],
    })
    console.log('NFT Data', data)

    // We map all the nfts listed on an Array,
    // We use async await to let the function take time t fill the array
    const items = await Promise.all(
      // We go through the array item by item and search for specific information like ID and Image
      data.assets.map(
        async (i: { tokenId: any; imageUrl: { toString: () => any } }) => {
          // We structure the information input and variables we are storring
          let item = {
            tokenId: i.tokenId,
            image: i.imageUrl.toString(),
          }
          return item
        }
      )
    )
    // We set the NFT array to a React state
    setNfts(items)
  }

  const showItems = () => {
    setShowThis(true)
  }

  const hideItems = () => {
    setShowThis(false)
  }

  const [tokenList, setTokenList] = useState<any>([])
  const tokensMetadata = async () => {
    const { errors, tokens } = await fetchTokens(80001)
    console.log(tokens)
    setTokenList(tokens)
  }

  const swap = async () => {
    const { token, token2, swapAmount } = formInput3
    console.log(token)
    console.log(token2)
    console.log(swapAmount)
    // console.log(Server)
    // console.log(Swap)
    // console.log(Registry)
    // // "https://quickapi.com/"
    const provider = new ethers.providers.JsonRpcProvider(
      'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    )
    console.log('Provider:', provider)
    // We use the private key to get the full address instance
    let firstAccountOfWallet = new ethers.Wallet(privateKeyOfUser)
    // We get the signature information of the user
    let signerOfWallet = firstAccountOfWallet.connect(provider)
    console.log('signerOfWallet:', signerOfWallet)
    const swapContractAddress = '0x03710fb8e65070A4Bc6422d111a1beb7949e1a87' // '0x5F189f72Ed14E6A2d7d4A3fdd58E104a1c8C9024', FUJI
    const registryContractAddress = '0x054e6c06B044802BdF12136027C894ffd00d925A' // '0x4F290e83B414097C107F5AD483a9ae15434B43d3', FUJI
    const converterContractAddress =
      '0x04Ca0A9a349F5F24E7ca4e36a0a20D977518A033' // '0x9F11691FA842856E44586380b27Ac331ab7De93d', FUJI
    const airswap = new ethers.Contract(
      swapContractAddress,
      swapAbi,
      signerOfWallet
    )
    const airRegistry = new ethers.Contract(
      registryContractAddress,

      registryAbi,
      signerOfWallet
    )
    const airConverter = new ethers.Contract(
      converterContractAddress,

      converterAbi,
      signerOfWallet
    )
    const wToken1Contract = new ethers.Contract(token, abi, signerOfWallet)
    const wToken2Contract = new ethers.Contract(token2, abi, signerOfWallet)
    console.log('Swap Contract:', airswap)
    console.log('Swap Registry:', airRegistry)
    console.log('Swap Converter:', airConverter)
    console.log('WETH:', wToken1Contract)
    console.log('MATIC:', wToken2Contract)
    const big = BigInt(parseFloat(swapAmount) * 10 ** 18)
    const baseTokenURLs = await airRegistry.getURLsForToken(token)
    const quoteTokenURLs = await airRegistry.getURLsForToken(token2)
    await tokensMetadata()
    const serverURLs = baseTokenURLs.filter((amount: any) =>
      quoteTokenURLs.includes(amount)
    )
    console.log('Base token Urls:', baseTokenURLs)
    console.log('Quote token Urls:', quoteTokenURLs)
    console.log('Server Urls:', serverURLs)
    const nonce = await signerOfWallet.getTransactionCount()
    console.log('Nonce:', nonce)
    // const servers = await airRegistry.getServers(
    //   sendAddress,
    //   token
    // )
    const approval1 = await wToken1Contract.approve(swapContractAddress, big)
    const approval2 = await wToken2Contract.approve(swapContractAddress, big)
    // console.log("servers:",servers)
    console.log('Approval1:', approval1)
    console.log('Approval2:', approval2)
    // const order = provider2.getSignerSideOrder(
    //   amountCross,
    //   sendAddress,
    //   token,
    //   signerOfWallet.address,
    // )
    // console.log("order:",order)
    // const tx = await airswap.light(await order)
    const blockNum = await provider.getBlockNumber()
    const expiry = blockNum + 10
    const tx = await new airswap.light(
      nonce,
      expiry,
      signerOfWallet,
      wToken1Contract,
      swapAmount,
      wToken2Contract,
      swapAmount,
      v,
      r,
      s
    )
      console.log('tx:', tx)
    //   await wToken1Contract.approve(airswap, big).send({ from: addressOfUser })
    //   await wToken2Contract.approve(airswap, big).send({ from: addressOfUser })

    // const tx = await new airswap.light(order)


  }



  // Send COIN function -- ONLY USED FOR COINS not ERC20 Tokens
  async function sendCustomTransaction() {
    const provider = await new ethers.providers.JsonRpcProvider(
      'https://rpc.ankr.com/avalanche_fuji'
    )
    // We get the input values from user -- Must input 0x Address and Amount to send
    const { account2, amount } = formInput
    // Smart contracts uses 18 extra decimals so we have to transform the value into basic token value
    const sendValue = ethers.utils.parseUnits(amount, 'ether')
    console.log(sendValue)

    // We use the private key to get the full address instance
    let firstAccountOfWallet = new Wallet(privateKeyOfUser)
    // We get the signature information of the user
    let signerOfWallet = firstAccountOfWallet.connect(provider)

    // We get the balance of both addresses
    const senderBalanceBefore = await provider.getBalance(addressOfUser)
    const recieverBalanceBefore = await provider.getBalance(account2)
    console.log(
      `\nSender balance before: ${ethers.utils.formatEther(
        senderBalanceBefore
      )}`
    )
    console.log(
      `reciever balance before: ${ethers.utils.formatEther(
        recieverBalanceBefore
      )}\n`
    )

    // We get the current value of gas
    let gasPrice = provider.getGasPrice()

    // We define the inputs for the transaction
    const transaction = {
      from: addressOfUser, // Sender
      to: account2, // Reciever
      value: sendValue, // Amount sending
      nonce: provider.getTransactionCount(addressOfUser, 'latest'), // Nonce of address
      gasLimit: ethers.utils.hexlify(100000), // 100000 standard
      gasPrice: gasPrice, // GasPrice we got earlier
    }
    console.log(transaction)

    // We use the full instance of the signer address to send the transaction
    signerOfWallet
      // We exeute sendTransaction of the signer which already has an instance of ethers and can call functions
      .sendTransaction(transaction)
      // We fetch the event emited by the interface with the transaction information
      .then((validatedTransaction: any) => {
        // We alert the user that transaction was successfully validated
        console.dir(validatedTransaction)
        alert('Send finished!')
      })
  }



  async function crossChain() {
    const { token, amountCross, sendChain } = formInput2
    console.log(token)
    console.log(amountCross)
    const provider = new ethers.providers.JsonRpcProvider(
      'https://rpc.ankr.com/avalanche_fuji'
    )

    console.log('Provider:', provider)

    // We use the private key to get the full address instance
    let firstAccountOfWallet = new ethers.Wallet(privateKeyOfUser)
    // We get the signature information of the user
    let signerOfWallet = firstAccountOfWallet.connect(provider)
    console.log('signerOfWallet:', signerOfWallet)

    const gatewayContractAddress = '0xC249632c2D40b9001FE907806902f63038B737Ab'
    const axelarGateway = new ethers.Contract(
      gatewayContractAddress,
      axelarGatewayAbi,
      signerOfWallet
    )

    const tokenAddress = "0xAF82969ECF299c1f1Bb5e1D12dDAcc9027431160"
    const tokenContract = new ethers.Contract(
      tokenAddress,
      abi,
      signerOfWallet
    )

    console.log("Axelar Gateway:", axelarGateway)
    const approval = await tokenContract.approve(gatewayContractAddress, amountCross)
    console.log("approval:", approval)



    // await axelarGateway.sendToken(
    //   sendChain,
    //   signerOfWallet.address,
    //   tokenContract.symbol,
    //   amountCross
    // )

    // console.log("gatewayAddress:", gatewayAddress)
    // const environment: string = "testnet"; /*environment should be one of local | devnet | testnet | mainnet*/
    // const api: AxelarAPI = new AxelarAPI(environment);

    // const sdk = new AxelarAssetTransfer({
    //   environment: "testnet",
    //   auth: "local",
    // });

    // console.log("sdk:",sdk)
    // const depositAddress = await sdk.getDepositAddress(
    //   "avalanche", // source chain
    //   "terra", // destination chain
    //   "terra1qem4njhac8azalrav7shvp06myhqldpmkk3p0t", // destination address
    //   "uusd" // asset to transfer
    // );
    // console.log("depositAddress:",depositAddress)

  }





  return (
    <div className="">
      <Head>
        <title>Skia Wallet DEV</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-[#1b212c] shadow-md">
          <div className="absolute h-14 w-[13rem] p-2 pl-8" />
          <div className="mr-8  h-14">
            <Image
              src="/SkiaWalletLogo.png"
              layout="fixed"
              height={55}
              width={180}
              className="cursor-pointer"
            />
          </div>

          <div className="flex grow items-center justify-end gap-2">
            <Link href="/">
              <div className="scaleButton flex h-8 w-32 cursor-pointer items-center justify-around rounded-full bg-blue-500 p-2">
                <CurrencyDollarIcon className="scaleButton h-5 text-white" />
                <p className="w-16 truncate text-xs font-semibold text-white">
                  ${balance || 0}
                </p>
                <PlusCircleIcon className="scaleButton h-5 text-white" />
              </div>
            </Link>
            <Link href="/">
              <div className="siderMenuIconCircle scaleButton cursor-pointer">
                <BellIcon className="iconSize" />
              </div>
            </Link>
            <Link href="/">
              <div className="mr-8 flex h-10 cursor-pointer items-center rounded-full bg-gray-300 shadow-lg ">
                <Image
                  src="/SkiaWalletSymbol.png"
                  layout="fixed"
                  height={42}
                  width={42}
                  className="rounded-full  "
                />
                <div className="ml-1 scale-90 sm:w-24 ">
                  <p className="hidden w-24 truncate text-sm font-semibold sm:flex">
                    {addressOfUser}
                  </p>
                  <p className="scaleText ml-0.5 hidden text-xs sm:flex">
                    @username
                  </p>
                </div>
                <ChevronDownIcon className="scaleText h-5 pr-4" />
              </div>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="">
            <div className="siderOpacity sticky top-14 h-[45rem] shadow-md">
              <div className="absolute h-full bg-white"></div>
              <div className="relative z-20 ml-2">
                <div className="">
                  <h1 className="siderMenuTitle">Menu</h1>
                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle">
                        <ViewGridIcon className="iconSize" />
                      </div>
                      {showThis === true || (
                        <button
                          onClick={showItems}
                          className="siderMenuLinkText"
                        >
                          Show Dashboard
                        </button>
                      )}
                      {showThis === false || (
                        <button
                          onClick={hideItems}
                          className="siderMenuLinkText"
                        >
                          Hide Dashboard
                        </button>
                      )}
                    </div>
                  </Link>
                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <LightningBoltIcon className="iconSize" />
                      </div>
                      <button
                        onClick={generateMyMnemonic}
                        className="siderMenuLinkText"
                      >
                        Create Wallet
                      </button>
                    </div>
                  </Link>
                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <ShoppingBagIcon className="iconSize" />
                      </div>
                      <div>
                        <button
                          onClick={inputMnemonic}
                          className="siderMenuLinkText"
                        >
                          Import Mnemonic
                        </button>
                      </div>
                    </div>
                  </Link>
                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <HomeIcon className="iconSize" />
                      </div>
                      <h2 className="siderMenuLinkText ">My Wallet</h2>
                    </div>
                  </Link>
                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <ShoppingCartIcon className="iconSize" />
                      </div>
                      <button
                        onClick={sendCustomTransaction}
                        className="siderMenuLinkText"
                      >
                        Send Txn
                      </button>
                    </div>
                  </Link>
                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <SwitchHorizontalIcon className="iconSize" />
                      </div>
                      <h2 className="siderMenuLinkText ">Swap</h2>
                    </div>
                  </Link>
                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <HomeIcon className="iconSize" />
                      </div>
                      <h2 className="siderMenuLinkText ">Staking</h2>
                    </div>
                  </Link>
                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <BookmarkAltIcon className="iconSize" />
                      </div>
                      <div>
                        <button
                          className="siderMenuLinkText"
                          onClick={fetchNfts}
                        >
                          NFTs
                        </button>
                      </div>
                    </div>
                  </Link>

                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <ClipboardListIcon className="iconSize" />
                      </div>
                      <h2 className="siderMenuLinkText ">History</h2>
                    </div>
                  </Link>

                  <h1 className="siderMenuTitle">User Settings</h1>

                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <IdentificationIcon className="iconSize" />
                      </div>
                      <h2 className="siderMenuLinkText ">Profile</h2>
                    </div>
                  </Link>
                  <Link href="/">
                    <div className="siderMenuLinkWrapper">
                      <div className="siderMenuIconCircle ">
                        <TemplateIcon className="iconSize" />
                      </div>
                      <h2 className="siderMenuLinkText ">Settings</h2>
                    </div>
                  </Link>
                  <Link href="/">
                    <button className="m-3 flex h-12 w-32 items-center justify-center gap-2 rounded-full bg-blue-500">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                        <LogoutIcon className="h-6" />
                      </div>
                      <h2 className="mr-2 font-bold text-white ">Signout</h2>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <h1 className="siderMenuTitle">WELCOME TO SKIA</h1>
            <div>
              <div className="flex h-10 items-center">
                {showThis === false || (
                  <div className="">
                    <p className="p-4">{mnemonicOfUser || ''}</p>
                  </div>
                )}
              </div>
              <div className="flex">
                <div className="flex h-12 items-center pt-5">
                  {showThis === false || (
                    <div className="">
                      <p className="p-4">{addressOfUser}</p>
                    </div>
                  )}
                </div>
                <div></div>
              </div>
              <div className="flex h-20 items-center gap-4 p-4">
                <input
                  placeholder="Input your mnemonic"
                  className="mt-2 h-10 w-56 rounded-2xl border-2 p-4 "
                  onChange={(e) => updateMnemonicInput(e.target.value)}
                />
                <input
                  placeholder="Input your password"
                  className="mt-2 h-10 w-36 rounded-2xl border-2 p-4"
                  onChange={(e) => updatePasswordInput(e.target.value)}
                />
              </div>
            </div>
            <div className="flex h-10 items-center">
              {showThis === false || (
                <div className="">
                  <p className="p-4">{balance || 0} ETH</p>
                  <p className="">{}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pl-4">
              <input
                placeholder="Send to this account"
                className="mt-2 h-10 w-56 rounded-2xl border-2 p-4"
                onChange={(e) =>
                  updateFormInput({ ...formInput, account2: e.target.value })
                }
              />{' '}
              <input
                placeholder="Send this amount"
                type="number"
                className="mt-2 h-10 w-36 rounded-2xl border-2 p-4"
                onChange={(e) =>
                  updateFormInput({ ...formInput, amount: e.target.value })
                }
              />
            </div>
            <div className="flex flex-wrap items-center pl-4">
              <input
                placeholder="Token 1 address to send"
                className="mt-2 h-10 w-56 rounded-2xl border-2 p-4"
                onChange={(e) =>
                  updateFormInput2({ ...formInput2, token: e.target.value })
                }
              />
              <input
                placeholder="Send this amount"
                type="number"
                className="mt-2 ml-4 h-10 w-36 rounded-2xl border-2 p-4"
                onChange={(e) =>
                  updateFormInput2({
                    ...formInput2,
                    amountCross: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center pl-4">

              <input
                placeholder="Select a Chain"
                className="mt-2 h-10 w-56 rounded-2xl border-2 p-4 "
                onChange={(e) =>
                  updateFormInput2({ ...formInput2, sendChain: e.target.value })
                }
              />
            </div>
            <button
              onClick={crossChain}
              className="m-4 rounded-3xl bg-blue-500 p-3 text-white"
            >
              TEST CROSS
            </button>
            <div className="flex flex-wrap items-center pl-4">
              <input
                placeholder="Token 1 address to send"
                className="mt-2 h-10 w-56 rounded-2xl border-2 p-4"
                onChange={(e) =>
                  updateFormInput3({ ...formInput3, token: e.target.value })
                }
              />
              <input
                placeholder="Send this amount"
                type="number"
                className="mt-2 ml-4 h-10 w-36 rounded-2xl border-2 p-4"
                onChange={(e) =>
                  updateFormInput3({
                    ...formInput3,
                    swapAmount: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center pl-4">

              <input
                placeholder="Token 2 address to send"
                className="mt-2 h-10 w-56 rounded-2xl border-2 p-4 "
                onChange={(e) =>
                  updateFormInput3({ ...formInput3, token2: e.target.value })
                }
              />
            </div>
            <button
              onClick={swap}
              className="m-4 rounded-3xl bg-blue-500 p-3 text-white"
            >
              TEST SWAP
            </button>
            <div className="w-[40rem]">
              <div className="flex flex-wrap justify-center gap-4">
                {nfts.map((nft, i) => (
                  <div
                    key={i}
                    className="w-36 overflow-hidden rounded-xl border shadow"
                  >
                    <img src={nft.image} className="h-36 w-36" />
                    <div className="bg-indigo-400">
                      <p className="ml-2 mr-2 flex justify-center">
                        <a className="w-2/3 truncate">{nft.tokenId}</a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  )
}

export default Home

