import { Entity } from '@skiawallet/common';
import * as bip39 from 'bip39';
import { utils } from 'ethers';

export type UserWalletProps = {
  mnemonic: string;
  seed: string;
  firstAccount: utils.HDNode;
};

export class UserWallet extends Entity<UserWalletProps> {
  constructor({ mnemonic }: { mnemonic: string }) {
    const props: UserWalletProps = {
      mnemonic,
      seed: bip39.mnemonicToSeedSync(mnemonic).toString('hex'),
      firstAccount: Utils.createWalletAccount(mnemonic, 0),
    };
    super(props);
  }

  get mnemonic(): string {
    return this.props.mnemonic;
  }

  /**
   * Get the seed of the wallet.
   *
   * It's the hexadecimal form of the mnemonic phrase.
   */
  get seed(): string {
    return this.props.seed;
  }

  /**
   * First account of the wallet
   * Don't use directly as a private or public address.
   */
  get firstAccount(): utils.HDNode {
    return this.props.firstAccount;
  }
}

class Utils {
  /**
   * Create a wallet account
   *
   * @param mnemonic string
   * @param number number - Only use
   * @returns
   */
  static createWalletAccount(mnemonic: string, number: number): utils.HDNode {
    // It sincronizes the mnemonic to be EVM compatible
    const hdNode = utils.HDNode.fromMnemonic(mnemonic);

    // It retrieves the package data of the account.
    const numberOfWalletAccount = hdNode.derivePath(`m/44'/60'/0'/0/${number}`);

    return numberOfWalletAccount;

    // // Setting state to store the variables as string
    // setMnemonicOfUser(mnemonicInput)
    // setSeedOfUser(seed)
    // setPrivateKeyOfUser0x(firstAccount.privateKey)
    // setPrivateKeyOfUser(firstAccount.privateKey.substring(2))
    // setaddressOfUser(firstAccount.address)
  }

  // static generateMnemonic(){
  //   const generateMyMnemonic = () => {
  //     // We generate a random mnemonic with BIP39
  //     const mnemonic = bip39.generateMnemonic()
  //     console.log('mnemonic:', mnemonic)
  //     // We sincronize the Mnemonic to be EVM compatible
  //     const hdNode = utils.HDNode.fromMnemonic(mnemonic)
  //     console.log('hdnNde:', hdNode)
  //     // We retrieve the package data of the FIRST account -- DON'T USE DIRECTLY AS ADDRESS
  //     const firstAccount = hdNode.derivePath(`m/44'/60'/0'/0/0`) // This returns a first account of wallet
  //     console.log('firstAccount:', firstAccount)
  //     // We retrieve the package data of the SECOND account -- DON'T USE DIRECTLY AS ADDRESS
  //     const secondAccount = hdNode.derivePath(`m/44'/60'/0'/0/1`)
  //     console.log('secondAccount:', secondAccount)
  //     // More addresses can be fetched by this method
  //     // const thirdAccount = hdNode.derivePath(`m/44'/60'/0'/0/2`)
  //     // console.log('thirdAccount:', thirdAccount)
  //     // const fourthAccount = hdNode.derivePath(`m/44'/60'/0'/0/3`)
  //     // console.log('fourthAccount:', fourthAccount)
  //     const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
  //     console.log('Seed:', seed)
  //     // Setting state to store the variables as string
  //     setMnemonicOfUser(mnemonic)
  //     setSeedOfUser(seed)
  //     setPrivateKeyOfUser0x(firstAccount.privateKey)
  //     setPrivateKeyOfUser(firstAccount.privateKey.substring(2))
  //     setaddressOfUser(firstAccount.address)
  //     setWalletOfUser(firstAccount)
  //   }
}
