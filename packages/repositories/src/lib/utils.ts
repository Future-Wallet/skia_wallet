import { AccountOfWallet, UserWallet } from '@skiawallet/entities';
import * as bip39 from 'bip39';
import { utils, Wallet } from 'ethers';
import { jsonRpcProvider } from './api';

export class Utils {
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

  static generateMnemonic(): UserWallet {
    const mnemonic = bip39.generateMnemonic();

    return new UserWallet(mnemonic);
  }
}
