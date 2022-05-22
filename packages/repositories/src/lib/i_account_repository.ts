import { Result } from 'ts-results';
import { Account, AccountAddress } from '@skiawallet/entities';

export abstract class IAccountRepository {
  abstract createAccount(): Result<Account, string>;

  abstract getAccount(publicAddress: AccountAddress): Result<Account, string>;

  abstract getAccounts(): Promise<Result<Account[], string>>;
}
