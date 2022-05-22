import { Err, Ok, Result } from 'ts-results';
import Portis from '@portis/web3';
import Web3 from 'web3';
import 'dotenv/config';
import { Account, AccountAddress } from '@skiawallet/entities';

import { IAccountRepository } from './i_account_repository';
import { mockAccounts } from './mock_data';

export class AccountRepositoryPortis implements IAccountRepository {
  // private accountRepository: IAccountRepository;

  // constructor(accountRepository: IAccountRepository) {
  //   this.accountRepository = accountRepository;
  // }

  createAccount(): Result<Account, string> {
    return Account.create(mockAccounts[0]);
  }

  getAccount(publicAddress: AccountAddress): Result<Account, string> {
    const exist = mockAccounts.find(
      (el) => el.publicAddress.value == publicAddress.value
    );

    if (exist == undefined)
      return Err(`Account ${publicAddress} doesn't exist`);

    return Ok(exist);
  }

  async getAccounts(): Promise<Result<Account[], string>> {
    const portis = new Portis(
      process.env.REACT_APP_PORTIS_SDK_APP_ID_TEST!,
      'mainnet',
      { scope: ['email'] }
    );

    const web3 = new Web3(portis.provider);

    // Get the accounts associated to Portis Wallet.
    try {
      // let result: Result<Account[], string>;

      const accounts = await web3.eth.getAccounts();
      // Transform the accounts received from web3 to the entities Account.
      const list = accounts.map((el) => {
        const address = AccountAddress.create({
          value: el,
        });

        if (address.err) {
          return Err(address.val);
        } else {
          return Account.create({
            email: 'test@test.com',
            password: 'test_A',
            publicAddress: address.val,
          });
        }
      });

      return Result.all(...list);
    } catch (err) {
      return Err('Error getting the accounts associated to the wallet');
    }
  }
}
