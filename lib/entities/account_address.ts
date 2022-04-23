import { Err, Ok, Result } from 'ts-results';
import { Guard } from '../shared/guard';
import { ValueObject } from '../shared/value_object';

interface AccountAddressProps {
	value: string;
}

export class AccountAddress extends ValueObject<AccountAddressProps> {
	get value(): string {
		return this.props.value;
	}

	private constructor(props: AccountAddressProps) {
		super(props);
	}

	// TODO: create tests to be sure `message` is never null.
	public static create(
		props: AccountAddressProps
	): Result<AccountAddress, string> {
		const nullGuardResult = Guard.againstNullOrUndefined(props.value, 'value');

		if (!nullGuardResult.succeeded) {
			return Err(nullGuardResult.message!);
		}

		const isAnAddress = Guard.isAnAddress(props.value);

		if (!isAnAddress.succeeded) {
			return Err(isAnAddress.message!);
		}

		return Ok(new AccountAddress(props));
	}
}
