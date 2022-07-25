import { ethers } from 'ethers';

// Avalanche C-chain Fuji (testnet)
const providerUrl = 'https://api.avax-test.network/ext/bc/C/rpc';

export default class Api {
  static getProvider(): ethers.providers.BaseProvider {
    return ethers.getDefaultProvider(providerUrl);
  }

  /**
   * Get balance of an account in AVAXs.
   * @param publicAddressOfAccount {string}
   */
  static async getBalance(publicAddressOfAccount: string): Promise<number> {
    const balance = await Api.getProvider().getBalance(publicAddressOfAccount);

    // Convert a currency unit from `wei` to `ether`
    const balanceInAvax = ethers.utils.formatEther(balance);

    return Number(balanceInAvax);
  }
}
