import { Result, Ok } from 'ts-results';
import { Entity } from '../shared/entity';

interface AccountProps {
	email: string;
	password: string;
}

export class Account extends Entity<AccountProps> {
	get id(): string {
		return this._id;
	}

	get email(): string {
		return this.props.email;
	}

	get password(): string {
		return this.props.password;
	}
	private constructor(props: AccountProps, id?: string) {
		super(props, id);
	}

	public static create(props: AccountProps, id?: string): Result<Account, any> {
		// TODO: add value objects (for validating the fields email and password).
		// If there's an error, return Err()

		return Ok<Account>(new Account(props, id));
	}
}
