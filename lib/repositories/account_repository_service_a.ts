import { Err, Ok, Result } from 'ts-results';
import { Account } from '../entities/account';
import { AccountAddress } from '../entities/account_address';
import { IAccountRepository } from './i_account_repository';
import { mockAccounts } from './mock_data';

class AccountRepositoryServiceA implements IAccountRepository {
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
}
