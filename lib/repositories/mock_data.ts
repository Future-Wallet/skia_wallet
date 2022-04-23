import { Account, AccountProps } from '../entities/account';
import { AccountAddress } from '../entities/account_address';

export const mockAccounts: Account[] = [
	Account.create({
		email: 'example_a@example.com',
		password: 'password_a',
		publicAddress: AccountAddress.create({
			value: '0x0123456789012345678901234567890123456789',
		}).val as AccountAddress,
	}).val as Account,
	Account.create({
		email: 'example_b@example.com',
		password: 'password_b',
		publicAddress: AccountAddress.create({
			value: '0x0123456789012345678901234567890123456789',
		}).val as AccountAddress,
	}).val as Account,
];
