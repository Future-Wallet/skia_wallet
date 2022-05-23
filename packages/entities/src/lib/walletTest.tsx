import type { NextPage } from 'next'
import Head from 'next/head'
import * as bip39 from 'bip39'
import { utils, Wallet, ethers } from 'ethers'
import { useState } from 'react'

// THIS IS FOR USE OF BUFFER
// const buffer = bip39.mnemonicToSeedSync(mnemonic)
// console.log("buffer:",buffer)
// // const buffer2 = bip39.mnemonicToSeed(mnemonic).then(console.log)
// const buffer3 = bip39.mnemonicToSeedSync(mnemonic, '12345678')
// console.log("buffer3:",buffer3)
// const validate = bip39.validateMnemonic(mnemonic)
// console.log("validate",validate)
// THIS IS TO ENTER MNEMONIC IN ETHERS

//THIS IS TO GET MORE ACCOUNTS
// const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`); // This returns a new HDNode
// console.log("secondAccount:",secondAccount)
// const thirdAccount = hdNode.derivePath(`m/44'/60'/0'/0/2`);
// console.log("thirdAccount:",thirdAccount)
// const wallet = new Wallet(hdNode);
// console.log("wallet:",wallet)

const Home: NextPage = () => {
  const [mnemonicOfUser, setMnemonicOfUser] = useState('')
  const [walletOfUser, setWalletOfUser] = useState('')
  const [seedOfUser, setSeedOfUser] = useState('')
  const [privateKeyOfUser, setProvateKeyOfUser] = useState('')
  const [privateKeyOfUser0x, setProvateKeyOfUser0x] = useState('')
  const [showThis, setShowThis] = useState(false)
  //THIS IS TO SET IT WHIT A NEW WALLET
  // const signer = ethers.Wallet.createRandom();
  // const signer = provider.getSigner()
  // const signature = async () => {
  //   const signature = await signer.signMessage('Some data')
  //   return signature
  // }
  const INFURA_ID = 'f4bd7d496b96423fb33b10cf61aa231e'
  // const url = 'https://api.avax-test.network/ext/bc/C/rpc'
  const provider = new ethers.providers.JsonRpcProvider(
    `https://kovan.infura.io/v3/${INFURA_ID}`
  ) //

  const generateMyMnemonic = () => {
    const mnemonic = bip39.generateMnemonic()
    console.log('mnemonic:', mnemonic)
    const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
    console.log('Seed:', seed)
    const hdNode = utils.HDNode.fromMnemonic(mnemonic)
    console.log('hdnNde:', hdNode)
    setMnemonicOfUser(mnemonic)
    setSeedOfUser(seed)
    setProvateKeyOfUser0x(hdNode.privateKey)
    setProvateKeyOfUser(hdNode.privateKey.substring(2))
    setWalletOfUser(hdNode.address)
  }
  const showItems = () => {
    setShowThis(true)
  }
  const account1 = walletOfUser // Your account address 1
  const account2 = '0x584A7892d3f7E7F98EE2458bC3FcaBabF0b8f9bc' // Your account address 2

  const send = async () => {
    let wallet = new Wallet(privateKeyOfUser)
    let walletSigner = wallet.connect(provider)
    console.log('wallet:', wallet)
    bip39.setDefaultWordlist('english')
    console.log('word list', bip39.wordlists)
    const senderBalanceBefore = await provider.getBalance(account1)
    const recieverBalanceBefore = await provider.getBalance(account2)
    let gasPrice = provider.getGasPrice()
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

    const tx = {
      from: account1,
      to: account2,
      value: ethers.utils.parseEther('0.0001'),
      nonce: provider.getTransactionCount(account1, 'latest'),
      gasLimit: ethers.utils.hexlify(100000), // 100000
      gasPrice: gasPrice,
    }

    console.log(tx)
    setTimeout(function(){
      //do what you need here
  }, 200000);
    walletSigner.sendTransaction(tx).then((transaction) => {
      console.dir(transaction)
      alert('Send finished!')
    })

    const senderBalanceAfter = await provider.getBalance(account1)
    const recieverBalanceAfter = await provider.getBalance(account2)

    console.log(
      `\nSender balance after: ${ethers.utils.formatEther(senderBalanceAfter)}`
    )
    console.log(
      `reciever balance after: ${ethers.utils.formatEther(
        recieverBalanceAfter
      )}\n`
    )
  }

  return (
    <div className="">
      <Head>
        <title>Skia Wallet DEV</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h1 className="">WLECOME TO SKIA</h1>
        <button
          onClick={generateMyMnemonic}
          className="rounded-xl bg-blue-500 p-4 text-center font-bold text-white"
        >
          Generate
        </button>
        <p className="">{mnemonicOfUser}</p>
        <p className="">{seedOfUser}</p>
        <p className="">{walletOfUser}</p>
        <p className="">{privateKeyOfUser}</p>
        <p className="">{privateKeyOfUser0x}</p>
        <button
          onClick={showItems}
          className="rounded-xl bg-blue-500 p-4 text-center font-bold text-white"
        >
          Show
        </button>
        {showThis === false || (
          <div>
            <p className="">{mnemonicOfUser}</p>
            <p className="">{seedOfUser}</p>
            <p className="">{walletOfUser}</p>
            <p className="">{privateKeyOfUser}</p>
            <p className="">{privateKeyOfUser0x}</p>
          </div>
        )}
        <button
          onClick={send}
          className="rounded-xl bg-blue-500 p-4 text-center font-bold text-white"
        >
          Send AVAX
        </button>
      </main>

      <footer className=""></footer>
    </div>
  )
}

export default Home
