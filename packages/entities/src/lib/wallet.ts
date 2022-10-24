import { Entity, EntityProps, Error } from '@skiawallet/common';
import * as bip39 from 'bip39';
import { utils } from 'ethers';
import { Err, Ok, Result } from 'ts-results';

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
   * In Ethereum world it's `Mnemonic.path`.
   */
  path: string;
}

export type AccountOfWalletParameters = {
  phrase: string;
  locale: MnemonicLocale;
  number?: 1;
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
  get path(): string {
    return this.props.path;
  }

  public static create({
    phrase,
    locale = MnemonicLocale.en,
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
      // For now, we only create the subaccount 0.
      accountHdNode = createChildOfHdNode(mnemonicPhrase.val.value, 0);

      if (accountHdNode.ok) {
        publicAddress = Address.create(accountHdNode.val.address);
        if (publicAddress.err) errors.push(...publicAddress.val);

        if (mnemonicPhrase.ok && accountHdNode.ok && publicAddress.ok) {
          return Ok(
            new AccountOfWallet({
              mnemonicPhrase: mnemonicPhrase.val,
              publicAddress: publicAddress.val,
              path: accountHdNode.val.path,
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
    const locale = MnemonicLocale.en,
      accounts = [];
    let hdNode, mnemonicPhrase, publicAddress, seed;
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
      hdNode = createHdNode(mnemonicPhrase.val.value);

      if (hdNode.ok) {
        publicAddress = Address.create(hdNode.val.address);
        if (publicAddress.err) errors.push(...publicAddress.val);

        seed = bip39
          .mnemonicToSeedSync(mnemonicPhrase.val.value)
          .toString('hex');

        const firstAccount = AccountOfWallet.create({
          phrase: mnemonicPhrase.val.value,
          locale,
          number: 1,
        });
        if (firstAccount.err) errors.push(...firstAccount.val);
        else accounts.push(firstAccount.val);

        if (mnemonicPhrase.ok && publicAddress.ok && firstAccount.ok) {
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
  number: 0
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
    return Ok(hdNode.val.derivePath(`m/44'/60'/0'/0/${number}`));
  } catch (err) {
    return Err(new ErrorWalletInvalidDerivationOfHdNode(number));
  }
}
