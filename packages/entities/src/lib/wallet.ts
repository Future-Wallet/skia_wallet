import { Entity, EntityProps, Error } from '@skiawallet/common';
import * as bip39 from 'bip39';
import { utils, Wallet } from 'ethers';
import { Err, Ok, Result } from 'ts-results';
import * as _ from 'lodash';
import { jsonRpcProvider } from '@skiawallet/repositories'

import { Address } from './address';
import { Mnemonic, MnemonicLocale } from './mnemonic';
import {
  ErrorWalletInvalidDerivationOfHdNode,
  ErrorWalletInvalidHdNode,
} from './wallet_errors';

export interface AccountOfWalletProps extends EntityProps {
  mnemonicPhrase: Mnemonic;
  /**
   * In Ethereum world it's `HdNode.address`.
   */
  publicAddress: Address;
  /**
   * Private key to sign`.
   */
  privateKey: string;
  /**
   * In Ethereum world it's `Mnemonic.path`.
   */
  path: string;
  /**
   * Index of mnemonic derivation`.
   */
  index: number;
  /**
   * Indicates active account`.
   */
  active: boolean;
}

export type AccountOfWalletParameters = {
  phrase: string;
  locale: MnemonicLocale;
  index: number;
  active: boolean;
};

export class AccountOfWallet extends Entity<AccountOfWalletProps> {
  /**
   * @param phrase {string}
   */
  constructor(props: AccountOfWalletProps) {
    super(props);
  }

  get mnemonicPhrase(): Mnemonic {
    return this.props.mnemonicPhrase;
  }
  get publicAddress(): Address {
    return this.props.publicAddress;
  }
  get privateKey(): string {
    return this.props.privateKey;
  }
  get path(): string {
    return this.props.path;
  }
  get active(): boolean {
    return this.props.active;
  }

  public static create({
    phrase,
    locale = MnemonicLocale.en,
    index,
    active
  }: AccountOfWalletParameters): Result<
    AccountOfWallet,
    Error<string | number>[]
  > {
    let accountHdNode, mnemonicPhrase, publicAddress;
    const errors: Error<string | number>[] = [];

    // It creates automatically a random mnemonic.
    if (phrase == undefined) {
      mnemonicPhrase = Mnemonic.create({ locale: MnemonicLocale.en });
    } else {
      mnemonicPhrase = Mnemonic.create({ locale, value: phrase });
    }

    if (mnemonicPhrase.ok) {
      accountHdNode = createChildOfHdNode(mnemonicPhrase.val.value, index);

      if (accountHdNode.ok) {
        publicAddress = Address.create(accountHdNode.val.address);
        if (publicAddress.err) errors.push(...publicAddress.val);

        if (mnemonicPhrase.ok && accountHdNode.ok && publicAddress.ok) {
          return Ok(
            new AccountOfWallet({
              mnemonicPhrase: mnemonicPhrase.val,
              publicAddress: publicAddress.val,
              privateKey: accountHdNode.unwrap().privateKey,
              path: accountHdNode.val.path,
              index,
              active,
            })
          );
        }
      } else {
        errors.push(accountHdNode.val);
      }
    } else {
      errors.push(...mnemonicPhrase.val);
    }

    return Err(errors);
  }

  getSigner(): Wallet {
    console.log('this.mnemonicPhrase.value', this.mnemonicPhrase.value)
    console.log('this.publicAddress', this.publicAddress)
    console.log('this.privateKey', this.privateKey)
    return new Wallet(
      this.privateKey,
      jsonRpcProvider
    );
  }

}

// export interface UserWalletProps extends EntityProps {
export interface UserWalletProps extends EntityProps {
  mnemonicPhrase: Mnemonic;
  seed: string;
  /**
   * In Ethereum world it's `HdNode.address`.
   */
  publicAddress: Address;
  accounts: AccountOfWallet[];
}

export type UserWalletParameters = {
  mnemonic?: Mnemonic;
};



type PlainObject = {
  props: {
    mnemonicPhrase: {
      props: {
        value: string,
        locale: string
      }
    };
    publicAddress: { props: { value: string } };
    seed: { value: string };
    accounts: [
      {
        props: {
          mnemonicPhrase: {
            props: {
              value: string,
              locale: string
            }
          };
          privateAddress: string;
          publicAddress: { props: { value: string } };
          path: string;
          active: boolean;
          index: number;
        };
      }
    ];
  };
};

/**
 * It's based on Hierarchal Deterministic (HD) wallet, an standard created for Bitcoin.
 *
 * More info here: https://docs.ethers.io/v5/api/utils/hdnode/#hdnodes
 */
export class UserWallet extends Entity<UserWalletProps> {
  private constructor(props: UserWalletProps) {
    super(props);
  }

  /**
   * It consists of 12, 15, 18, 21 or 24 words long and separated
   * by the whitespace specified by the language.
   */
  get mnemonicPhrase(): Mnemonic {
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

  get publicAddress(): Address {
    return this.props.publicAddress;
  }

  get accounts(): AccountOfWallet[] {
    return this.props.accounts;
  }

  get activeAccount(): AccountOfWallet | undefined {
    return _.find(this.props.accounts, x => x.active === true);
  }

  /**
   * It creates a wallet for the user.
   *
   * If no mnemonic string is provided, it generates automatically
   * a new wallet for the user.
   *
   * For now, it only creates one sub account.
   */
  public static create(
    params?: UserWalletParameters
  ): Result<UserWallet, Error<string | number>[]> {
    const locale = MnemonicLocale.en;
    let hdNode, mnemonicPhrase: Result<Mnemonic, Error<string>[]>, publicAddress, seed;
    const errors: Error<string | number>[] = [];

    // It creates automatically a random mnemonic.
    if (params == undefined || params.mnemonic == undefined) {
      mnemonicPhrase = Mnemonic.create({ locale });
    } else {
      mnemonicPhrase = Mnemonic.create({
        locale,
        value: params.mnemonic.value,
      });
    }

    if (mnemonicPhrase.ok) {
      const {
        value
      } = mnemonicPhrase.val

      hdNode = createHdNode(value);

      if (hdNode.ok) {
        publicAddress = Address.create(hdNode.val.address);
        if (publicAddress.err) errors.push(...publicAddress.val);

        seed = bip39
          .mnemonicToSeedSync(value)
          .toString('hex');

        if (mnemonicPhrase.ok && publicAddress.ok) {

          const accounts: AccountOfWallet[] = _.reduce(
            Array(10).fill(0),
            (acc: AccountOfWallet[], _: any, index: number) => {
              //TODO: Change return type to handle failure or retry
              const walletResult = AccountOfWallet.create({
                phrase: value,
                locale,
                index: index,
                active: index == 0
              });

              if (walletResult.ok)
                return acc.concat([walletResult.val])
              else return acc
            }, [])

          return Ok(
            new UserWallet({
              mnemonicPhrase: mnemonicPhrase.val,
              publicAddress: publicAddress.val,
              seed,
              accounts,
            })
          );
        }
      } else {
        errors.push(hdNode.val);
      }
    } else {
      errors.push(...mnemonicPhrase.val);
    }

    return Err(errors);
  }

  static parse(object: PlainObject): UserWallet | null {
    const mainWallet = object.props
    const mainWalletMnemonic = mainWallet.mnemonicPhrase.props
    const accounts = _.map(mainWallet.accounts, account => {
      console.log({
        phrase: account.props.mnemonicPhrase.props.value,
        locale: account.props.mnemonicPhrase.props.locale as MnemonicLocale,
        index: account.props.index,
        active: account.props.active
      })
      return AccountOfWallet.create({
        phrase: account.props.mnemonicPhrase.props.value,
        locale: account.props.mnemonicPhrase.props.locale as MnemonicLocale,
        index: account.props.index,
        active: account.props.active
      }).unwrap()
    })
    return new UserWallet({
      mnemonicPhrase: Mnemonic.create({
        value: mainWalletMnemonic.value,
        locale: mainWalletMnemonic.locale as MnemonicLocale
      }).unwrap(),
      seed: mainWallet.seed.value,
      publicAddress: Address.create(mainWallet.publicAddress.props.value).unwrap(),
      accounts: accounts
    })

  }
}

/**
 * It creates a Hierarchal Deterministic wallet.
 *
 * A standard created for Bitcoin, but lends itself well to a wide variety of Blockchains which rely on secp256k1 private keys.
 *
 * More on [docs.ethers.io](https://docs.ethers.io/v5/api/utils/hdnode/).
 *
 * @param mnemonic
 * @param number
 */
function createHdNode(
  mnemonicPhrase: string
): Result<utils.HDNode, ErrorWalletInvalidHdNode> {
  try {
    // It sincronizes the mnemonic to be EVM compatible
    const hdNode = utils.HDNode.fromMnemonic(mnemonicPhrase);

    return Ok(hdNode);
  } catch (err) {
    return Err(new ErrorWalletInvalidHdNode(mnemonicPhrase));
  }
}

/**
 * Creates a child of HDNode by deriving the path of its parent HDNode.
 *
 * More info on https://docs.ethers.io/v5/api/utils/hdnode/#HDNode-derivePath
 *
 * @param mnemonic string
 * @param number number - Only use 0.
 * @returns
 */
function createChildOfHdNode(
  mnemonicPhrase: string,
  index: number
): Result<
  utils.HDNode,
  ErrorWalletInvalidHdNode | ErrorWalletInvalidDerivationOfHdNode
> {
  // It sincronizes the mnemonic to be EVM compatible
  const hdNode = createHdNode(mnemonicPhrase);
  if (hdNode.err) {
    return Err(hdNode.val);
  }

  // It retrieves the package data of the HDNode.
  try {
    return Ok(hdNode.val.derivePath(`m/44'/60'/0'/0/${index}`));
  } catch (err) {
    return Err(new ErrorWalletInvalidDerivationOfHdNode(index));
  }
}
