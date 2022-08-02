import { ethers } from 'ethers';

import { AccountOfWallet, UserWallet, Utils } from './wallet_entity';

// Avalanche C-chain testnet Fuji https://docs.avax.network/apis/avalanchego/public-api-server#using-the-public-api-nodes
// 'https://rpc.ankr.com/avalanche_fuji'
export const nodeURL = 'https://api.avax-test.network/ext/bc/C/rpc';

export const jsonRpcProvider = new ethers.providers.JsonRpcProvider(nodeURL);

/**
 * It's a singleton (it disables the creation multiple Api instances).
 */
export default class Api {
  private static _instance?: Api;
  // @ts-expect-error
  private readonly _userWallet: UserWallet;

  private constructor(userWallet: UserWallet) {
    if (Api._instance) {
      throw new Error('Use Api.instance instead of new.');
    }

    Api._instance = this;
    this._userWallet = userWallet;
  }

  /**
   * Get the Api instance.
   */
  static getInstance(userWallet: UserWallet) {
    return Api._instance ?? (Api._instance = new Api(userWallet));
  }

  /**
   * Send money (coins), not ERC20 tokens.
   *
   * @param fromAccount {AccountOfWallet} Account that sends the money
   * @param toPublicAddress {string} Destination public address.
   * @param amountInEther {string} Amount in ether to be sent
   * @param gasPriceInWei {string} Gas price in wei
   */
  async sendMoney({
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

    // const provider = await new ethers.providers.JsonRpcProvider(
    //   'https://rpc.ankr.com/avalanche_fuji'
    // );

    // We get the input values from user -- Must input 0x Address and Amount to send
    // const { account2, amount } = formInput;

    // // Smart contracts uses 18 extra decimals so we have to transform the value into basic token value
    // const amountInEthers = Utils.convertNumberToEthers(amount);

    // // We use the private key to get the full address instance
    // // It substrings the `0x` of the private key.
    // const accountOfWallet = new Wallet(fromAccount.privateKey.substring(2));
    // // We get the signature information of the user
    // const signerOfWallet = firstAccountOfWallet.connect(provider);

    // We get the balance of both addresses
    // const senderBalanceBefore = await jsonRpcProvider.getBalance(addressOfUser);
    // const senderBalanceBefore = await jsonRpcProvider.getBalance(
    //   fromAccount.publicAddress
    // );

    // const recieverBalanceBefore = await jsonRpcProvider.getBalance(account2);
    // const recieverBalanceBefore = await jsonRpcProvider.getBalance(
    //   toPublicAddress
    // );
    // console.log(
    //   `\nSender balance before: ${ethers.utils.formatEther(
    //     senderBalanceBefore
    //   )}`
    // );
    // console.log(
    //   `reciever balance before: ${ethers.utils.formatEther(
    //     recieverBalanceBefore
    //   )}\n`
    // );

    const transaction = {
      // from: addressOfUser, // Sender
      // to: account2, // Reciever
      // value: sendValue, // Amount sending
      // nonce: provider.getTransactionCount(addressOfUser, 'latest'), // Nonce of address
      // gasLimit: ethers.utils.hexlify(100000), // 100000 standard
      // gasPrice: gasPrice, // GasPrice we got earlier
      from: fromAccount.props.publicAddress,
      to: toPublicAddress,
      value: Utils.convertEtherToWei(amountInEther),
      // An account nonce is a transaction counter in each account.
      // This prevents replay attacks. For example, a transaction
      // sending 20 coins from A to B can be replayed by B over
      // and over to continually drain A’s balance, but the account
      // nonce can prevent that.
      nonce: jsonRpcProvider.getTransactionCount(
        fromAccount.props.publicAddress,
        'latest'
      ),
      // 100000 is the standard
      gasLimit: ethers.utils.hexlify(100000),
      gasPrice: ethers.BigNumber.from(gasPriceInWei),
    };
    console.log(transaction);

    return await Utils.createSignerFromAccountOfWallet(
      // this._userWallet
      fromAccount
    ).sendTransaction(transaction);
  }

  /**
   * Get balance of an account in ether.
   *
   * @params publicAddressOfAccount {string}
   * @returns {string} Balance in ether
   */
  static async getBalance(publicAddressOfAccount: string): Promise<string> {
    const balance = await jsonRpcProvider.getBalance(publicAddressOfAccount);

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
