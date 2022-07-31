import { Entity } from '@skiawallet/common';
import * as bip39 from 'bip39';
import { utils, Wallet } from 'ethers';
import { jsonRpcProvider } from './api';

export type AccountOfWalletProps = {
  mnemonicPhrase: string;
  /**
   * In Ethereum world it's `HdNode.privateKey`.
   */
  privateAddress: string;
  /**
   * In Ethereum world it's `HdNode.address`.
   */
  publicAddress: string;
  /**
   * In Ethereum world it's `Mnemonic.path`.
   */
  path: string;
  language: string;
};

export class AccountOfWallet extends Entity<AccountOfWalletProps> {
  /**
   * @param phrase {string}
   */
  constructor(phrase: string) {
    const firstAccount = Utils.createChildOfHdNode(phrase, 0);

    if (firstAccount.mnemonic === undefined)
      throw Error('It can code the language of the account');

    const props: AccountOfWalletProps = {
      mnemonicPhrase: phrase,
      privateAddress: firstAccount.privateKey,
      publicAddress: firstAccount.address,
      path: firstAccount.path,
      language: firstAccount.mnemonic.locale,
    };

    super(props);
  }

  get mnemonicPhrase(): string {
    return this.props.mnemonicPhrase;
  }
  get privateAddress(): string {
    return this.props.privateAddress;
  }
  get publicAddress(): string {
    return this.props.publicAddress;
  }
  get path(): string {
    return this.props.path;
  }
  get language(): string {
    return this.props.language;
  }
}

export type UserWalletProps = {
  mnemonicPhrase: string;
  seed: string;
  /**
   * In Ethereum world it's `HdNode.privateKey`.
   */
  privateAddress: string;
  /**
   * In Ethereum world it's `HdNode.address`.
   */
  publicAddress: string;
  accounts: AccountOfWallet[];
};

/**
 * It's based on Hierarchal Deterministic (HD) wallet, an standard created for Bitcoin.
 *
 * More info here: https://docs.ethers.io/v5/api/utils/hdnode/#hdnodes
 */
export class UserWallet extends Entity<UserWalletProps> {
  /**
   * @param phrase {string}
   */
  constructor(phrase: string) {
    const firstAccount = new AccountOfWallet(phrase);

    const props: UserWalletProps = {
      mnemonicPhrase: phrase,
      privateAddress: Utils.createHdNode(phrase).privateKey,
      publicAddress: Utils.createHdNode(phrase).address,
      seed: bip39.mnemonicToSeedSync(phrase).toString('hex'),
      accounts: [firstAccount],
    };
    super(props);
  }

  /**
   * It consists of 12, 15, 18, 21 or 24 words long and separated
   * by the whitespace specified by the locale.
   */
  get mnemonicPhrase(): string {
    return this.props.mnemonicPhrase;
  }

  /**
   * Get the seed of the wallet.
   *
   * It's the hexadecimal form of the mnemonic phrase.
   */
  get seed(): string {
    return this.props.seed;
  }

  get privateAddress(): string {
    return this.props.privateAddress;
  }

  get publicAddress(): string {
    return this.props.publicAddress;
  }

  get accounts(): AccountOfWallet[] {
    return this.props.accounts;
  }
}

export class Utils {
  /**
   *
   * @param mnemonic
   * @param number
   */
  static createHdNode(mnemonic: string): utils.HDNode {
    // It sincronizes the mnemonic to be EVM compatible
    return utils.HDNode.fromMnemonic(mnemonic);
  }
  /**
   * Creates a dhil of HdNode by deriving the path of its parent HdNode.
   *
   * More info on https://docs.ethers.io/v5/api/utils/hdnode/#HDNode-derivePath
   *
   * @param mnemonic string
   * @param number number - Only use
   * @returns
   */
  static createChildOfHdNode(mnemonic: string, number: number): utils.HDNode {
    // It sincronizes the mnemonic to be EVM compatible
    const hdNode = Utils.createHdNode(mnemonic);

    // It retrieves the package data of the HdNode.
    return hdNode.derivePath(`m/44'/60'/0'/0/${number}`);
  }

  /**
   * Convert an amount to ether (type `BigNumber`).
   *
   * More info about ether units here https://docs.ethers.io/v5/api/utils/display-logic/#display-logic--named-units
   *
   * @param ether
   * @returns {string} Quantity in ethers
   */
  static convertEtherToWei(ether: string): string {
    return utils.parseUnits(ether, 'ether').toString();
  }

  /**
   * Convert wei to ether.
   *
   * More info about conversions here https://docs.ethers.io/v5/api/utils/display-logic/#unit-conversion
   * @param wei
   * @returns
   */
  static convertWeiToEther(wei: string): string {
    return utils.formatUnits(wei, 'ether');
  }

  /**
   * It creates a `Wallet` (a subtype of `Signer`) and can sign
   * transactions and messages using a private key as a standard
   * Externally Owned Account (EOA).
   *
   * > A **Signer** in ethers is an abstraction of an Ethereum Account, which
   * > can be used to sign messages and transactions and send signed transactions
   * > to the Ethereum Network to execute state changing operations.
   * >
   * > More info on https://docs.ethers.io/v5/api/signer/
   *
   * @param privateAddress {string}
   * @returns {Wallet}
   */
  static createSignerFromAccountOfWallet(
    // userWallet: UserWallet
    account: AccountOfWallet
  ): Wallet {
    // It remove the `0x` of the private address.
    const signer = new Wallet(
      // userWallet.props.privateAddress.substring(2),
      account.props.privateAddress,
      jsonRpcProvider
    );

    // const signer = new Wallet(account.publicAddress);
    // const signer = new Wallet(account.publicAddress.substring(2));

    // return signer.connect(jsonRpcProvider);
    return signer;
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
  //     console.log('Sed:', seed)
  //     setWalletOfUser(firstAccount)
  //   }
}
