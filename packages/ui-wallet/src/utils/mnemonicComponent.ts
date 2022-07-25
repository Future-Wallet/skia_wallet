import * as bip39 from 'bip39';
import { utils } from 'ethers';
import { useState } from 'react';

// // We set state of the variables we are storing
// const [mnemonicOfUser, setMnemonicOfUser] = useState('')
// const [addressOfUser, setaddressOfUser] = useState('')
// const [seedOfUser, setSeedOfUser] = useState('')
// const [privateKeyOfUser, setPrivateKeyOfUser] = useState('')
// const [privateKeyOfUser0x, setPrivateKeyOfUser0x] = useState('')
// const [walletOfUser, setWalletOfUser] = useState<any>()

const generateMyMnemonic = () => {
  // We generate a random mnemonic with BIP39
  const mnemonic = bip39.generateMnemonic();
  console.log('mnemonic:', mnemonic);
  // We sincronize the Mnemonic to be EVM compatible
  const hdNode = utils.HDNode.fromMnemonic(mnemonic);
  console.log('hdnNde:', hdNode);
  // We retrieve the package data of the FIRST account -- DON'T USE DIRECTLY AS ADDRESS
  const firstAccount = hdNode.derivePath(`m/44'/60'/0'/0/0`); // This returns a first account of wallet
  console.log('firstAccount:', firstAccount);
  // We retrieve the package data of the SECOND account -- DON'T USE DIRECTLY AS ADDRESS
  const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`);
  console.log('secondAccount:', secondAccount);
  // More addresses can be fetched by this method
  // const thirdAccount = hdNode.derivePath(`m/44'/60'/0'/0/2`)
  // console.log('thirdAccount:', thirdAccount)
  // const fourthAccount = hdNode.derivePath(`m/44'/60'/0'/0/3`)
  // console.log('fourthAccount:', fourthAccount)
  const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
  console.log('Seed:', seed);
  // Setting state to store the variables as string
  setMnemonicOfUser(mnemonic);
  setSeedOfUser(seed);
  setPrivateKeyOfUser0x(firstAccount.privateKey);
  setPrivateKeyOfUser(firstAccount.privateKey.substring(2));
  setaddressOfUser(firstAccount.address);
  setWalletOfUser(firstAccount);
};

// We set a state to store the mnemonic that user imports
const [mnemonicInput, updateMnemonicInput] = useState('');
const inputMnemonic = () => {
  // We decrypt the Mnemonic information to hex seed
  const seed = bip39.mnemonicToSeedSync(mnemonicInput).toString('hex');
  console.log('Seed:', seed);
  // We sincronize the Mnemonic to be EVM compatible
  const hdNode = utils.HDNode.fromMnemonic(mnemonicInput);
  console.log('hdnNde:', hdNode);
  // We retrieve the package data of the FIRST account -- DON'T USE DIRECTLY AS ADDRESS
  const firstAccount = hdNode.derivePath(`m/44'/60'/0'/0/0`); // This returns a new HDNode
  console.log('firstAccount:', firstAccount);
  // We retrieve the package data of the SECOND account -- DON'T USE DIRECTLY AS ADDRESS
  const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`); // This returns a new HDNode
  console.log('secondAccount:', secondAccount);
  // More addresses can be fetched by this method
  // const thirdAccount = hdNode.derivePath(`m/44'/60'/0'/0/2`)
  // console.log('thirdAccount:', thirdAccount)
  // const fourthAccount = hdNode.derivePath(`m/44'/60'/0'/0/3`)
  // console.log('fourthAccount:', fourthAccount)

  // Setting state to store the variables as string
  setMnemonicOfUser(mnemonicInput);
  setSeedOfUser(seed);
  setPrivateKeyOfUser0x(firstAccount.privateKey);
  setPrivateKeyOfUser(firstAccount.privateKey.substring(2));
  setaddressOfUser(firstAccount.address);
};
