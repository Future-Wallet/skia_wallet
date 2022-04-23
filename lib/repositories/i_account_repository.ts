import { Result } from 'ts-results';
import { Account } from '../entities/account';
import { AccountAddress } from '../entities/account_address';

export abstract class IAccountRepository {
	abstract createAccount(): Result<Account, string>;

	abstract getAccount(publicAddress: AccountAddress): Result<Account, string>;
}
