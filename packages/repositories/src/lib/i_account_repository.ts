import { Result } from 'ts-results';
import { UserWallet, Address } from '@skiawallet/entities';

export abstract class IAccountRepository {
  abstract createAccount(): Result<UserWallet, string>;

  abstract getAccount(publicAddress: Address): Result<UserWallet, string>;

  abstract getAccounts(): Promise<Result<UserWallet[], string>>;
}
