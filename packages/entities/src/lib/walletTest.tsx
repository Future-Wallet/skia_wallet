// This code uses npx create-next-app --example with-tailwindcss to init repository
// Steps to run this page:
// open console and npx create-next-app --example with-tailwindcss name-of-app
// yarn or npm install bip39 ethers
// Do: npm run dev on console to init on localhost:3000

import type { NextPage } from 'next'
import Head from 'next/head'
import * as bip39 from 'bip39'
import { utils, Wallet, ethers } from 'ethers'
import { useState } from 'react'
import { useRouter } from 'next/router'

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
  const [formInput, updateFormInput] = useState({
    account2: '',
    amount: '',
  })
  const router = useRouter()

  //THIS IS TO SET IT WHIT A NEW WALLET
  // const signer = ethers.Wallet.createRandom();
  // const signer = provider.getSigner()
  // const signature = async () => {
  //   const signature = await signer.signMessage('Some data')
  //   return signature
  // }
  // const INFURA_ID = 'f4bd7d496b96423fb33b10cf61aa231e'
  // const url =
  const provider = new ethers.providers.JsonRpcProvider(
    //`https://kovan.infura.io/v3/${INFURA_ID}`
    'https://rpc.ankr.com/avalanche_fuji'
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
  // Your account address 2

  const send = async () => {
    const account2 = walletOfUser // The account you want to send to
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
      value: ethers.utils.parseEther('1'),
      nonce: provider.getTransactionCount(account1, 'latest'),
      gasLimit: ethers.utils.hexlify(100000), // 100000
      gasPrice: gasPrice,
    }

    console.log(tx)
    setTimeout(function () {
      //do what you need here
    }, 200000)
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
  async function sendCustonTransaction() {
    const { account2 } = formInput
    const sendValue = ethers.utils.parseUnits(formInput.amount, 'ether')
    console.log(sendValue)
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
      value: sendValue,
      nonce: provider.getTransactionCount(account1, 'latest'),
      gasLimit: ethers.utils.hexlify(100000), // 100000
      gasPrice: gasPrice,
    }

    console.log(tx)
    setTimeout(function () {
      //do what you need here
    }, 200000)
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

      <main className="grid justify-center text-center">
        <h1 className="">WELCOME TO SKIA</h1>
        <div>
          {' '}
          <button
            onClick={generateMyMnemonic}
            className="w-24 rounded-xl bg-blue-500 p-4 text-center font-bold text-white"
          >
            Generate
          </button>
        </div>

        <p className="">{mnemonicOfUser}</p>
        <p className="">{seedOfUser}</p>
        <p className="">{walletOfUser}</p>
        <p className="">{privateKeyOfUser}</p>
        <p className="">{privateKeyOfUser0x}</p>
        <div>
          {' '}
          <button
            onClick={showItems}
            className="w-24 rounded-xl bg-blue-500 p-4 text-center font-bold text-white"
          >
            Show
          </button>
        </div>

        {showThis === false || (
          <div>
            <p className="">{mnemonicOfUser}</p>
            <p className="">{seedOfUser}</p>
            <p className="">{walletOfUser}</p>
            <p className="">{privateKeyOfUser}</p>
            <p className="">{privateKeyOfUser0x}</p>
          </div>
        )}
        <div>
          <button
            onClick={send}
            className="w-24 rounded-xl bg-blue-500 p-4 text-center font-bold text-white"
          >
            Send AVAX
          </button>
        </div>
        <div>
          {' '}
          <input
            placeholder="Send to this account"
            className="mt-2 w-72 rounded border-2 p-4 "
            onChange={(e) =>
              updateFormInput({ ...formInput, account2: e.target.value })
            }
          />
          <input
            placeholder="Send this amount"
            className="mt-2 w-72 rounded border-2 p-4 "
            onChange={(e) =>
              updateFormInput({ ...formInput, amount: e.target.value })
            }
          />
        </div>

        <div>
          {' '}
          <button
            onClick={sendCustonTransaction}
            className="mt-4 w-36 justify-center rounded-xl bg-blue-500 p-4 font-bold text-white shadow-lg"
          >
            Send Custon Transacton
          </button>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  )
}

export default Home
