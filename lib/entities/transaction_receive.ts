import { Ok, Result } from 'ts-results';
import { Entity } from '../shared/entity';

interface TransactionReceiveProps {
	address: string;
	amount: number;
}

export class TransactionReceive extends Entity<TransactionReceiveProps> {
	get id(): string {
		return this._id;
	}

	get address(): string {
		return this.props.address;
	}

	private constructor(props: TransactionReceiveProps, id?: string) {
		super(props, id);
	}

	public static create(
		props: TransactionReceiveProps,
		id?: string
	): Result<TransactionReceive, any> {
		// TODO: add value objects (for validating the fields email and password).
		// If there's an error, return Err()

		return Ok(new TransactionReceive(props, id));
	}
}
