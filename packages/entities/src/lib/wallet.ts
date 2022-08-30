import { Entity } from '@skiawallet/common';
import * as bip39 from 'bip39';
import { utils } from 'ethers';

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
    const firstAccount = createChildOfHdNode(phrase, 0);

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
      privateAddress: createHdNode(phrase).privateKey,
      publicAddress: createHdNode(phrase).address,
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

/**
 *
 * @param mnemonic
 * @param number
 */
function createHdNode(mnemonic: string): utils.HDNode {
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
function createChildOfHdNode(mnemonic: string, number: number): utils.HDNode {
  // It sincronizes the mnemonic to be EVM compatible
  const hdNode = createHdNode(mnemonic);

  // It retrieves the package data of the HdNode.
  return hdNode.derivePath(`m/44'/60'/0'/0/${number}`);
}
