import { Ok, Result } from 'ts-results';
import { Entity } from '../shared/entity';
import { Currency } from './types';

interface TransactionSendProps {
	address: string;
	currency: Currency;
	amount: number;
	fee: number;
}

export class TransactionSend extends Entity<TransactionSendProps> {
	get id(): string {
		return this._id;
	}

	get address(): string {
		return this.props.address;
	}

	get currency(): Currency {
		return this.props.currency;
	}

	get amount(): number {
		return this.props.amount;
	}

	get fee(): number {
		return this.props.fee;
	}

	private constructor(props: TransactionSendProps, id?: string) {
		super(props, id);
	}

	public static create(
		props: TransactionSendProps,
		id?: string
	): Result<TransactionSend, any> {
		// TODO: add value objects (for validating the fields email and password).
		// If there's an error, return Err()

		return Ok(new TransactionSend(props, id));
	}
}
