import { ethers } from 'ethers';
import { AccountOfWallet, Address } from '@skiawallet/entities';

import { Utils } from './utils';

// Avalanche C-chain testnet Fuji https://docs.avax.network/apis/avalanchego/public-api-server#using-the-public-api-nodes
// 'https://rpc.ankr.com/avalanche_fuji'
export const nodeURL = 'https://api.avax-test.network/ext/bc/C/rpc';

export const jsonRpcProvider = new ethers.providers.JsonRpcProvider(nodeURL);

/**
 * It's a singleton (it disables the creation multiple Api instances).
 */
export class Api {
  /**
   * Send money (coins), not ERC20 tokens.
   *
   * @param fromAccount {AccountOfWallet} Account that sends the money
   * @param toPublicAddress {string} Destination public address.
   * @param amountInEther {string} Amount in ether to be sent
   * @param gasPriceInWei {string} Gas price in wei
   */
  static async sendMoney({
    fromAccount,
    toPublicAddress,
    amountInEther,
    gasPriceInWei,
  }: {
    fromAccount: AccountOfWallet;
    toPublicAddress: string;
    amountInEther: string;
    gasPriceInWei: string;
  }): Promise<ethers.providers.TransactionResponse> {
    // Validation of the public address
    toPublicAddress = toPublicAddress.replace(/\s{1,}/g, '');
    if (ethers.utils.isAddress(toPublicAddress) === false)
      throw Error(`The address ${toPublicAddress} is an invalid format`);

    // Validation of the amount
    try {
      Utils.convertEtherToWei(amountInEther);
    } catch (err) {
      throw Error(`The amount ${amountInEther} is an invalid format`);
    }
    const transaction = {
      from: fromAccount.props.publicAddress.props.value,
      to: toPublicAddress,
      value: Utils.convertEtherToWei(amountInEther),
      // An account nonce is a transaction counter in each account.
      // This prevents replay attacks. For example, a transaction
      // sending 20 coins from A to B can be replayed by B over
      // and over to continually drain A’s balance, but the account
      // nonce can prevent that.
      nonce: jsonRpcProvider.getTransactionCount(
        fromAccount.props.publicAddress.props.value,
        'latest'
      ),
      // 100000 is the standard
      gasLimit: ethers.utils.hexlify(100000),
      gasPrice: ethers.BigNumber.from(gasPriceInWei),
    };

    return await Utils.createSignerFromAccountOfWallet(
      fromAccount
    ).sendTransaction(transaction);
  }

  /**
   * Get balance of an account in ether.
   *
   * @params publicAddressOfAccount {string}
   * @returns {string} Balance in ether
   */
  static async getBalance(publicAddressOfAccount: Address): Promise<string> {
    const balance = await jsonRpcProvider.getBalance(
      publicAddressOfAccount.value
    );

    // Convert a currency unit from `wei` to `ether`
    return ethers.utils.formatEther(balance);
  }

  /**
   * Get the current gas price in ethers.
   *
   *
   * @returns {string} Gas price in ether
   */
  static async getGasPrice(): Promise<string> {
    const gasPriceInWei = await jsonRpcProvider.getGasPrice();

    return Utils.convertWeiToEther(gasPriceInWei.toString());
  }
}
