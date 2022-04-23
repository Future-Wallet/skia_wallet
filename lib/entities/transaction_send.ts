import { Err, Ok, Result } from 'ts-results';
import { Entity } from '../shared/entity';
import { Guard } from '../shared/guard';
import { UniqueEntityId } from '../shared/unique_entity_id';
import { Token } from './tokens';

export interface TransactionSendProps {
	address: string;
	token: Token;
	amount: number;
	fee: number;
}

export class TransactionSend extends Entity<TransactionSendProps> {
	get id(): UniqueEntityId {
		return this._id;
	}

	get address(): string {
		return this.props.address;
	}

	get token(): Token {
		return this.props.token;
	}

	get amount(): number {
		return this.props.amount;
	}

	get fee(): number {
		return this.props.fee;
	}

	private constructor(props: TransactionSendProps, id?: UniqueEntityId) {
		super(props, id);
	}

	public static create(
		props: TransactionSendProps,
		id?: UniqueEntityId
	): Result<TransactionSend, string> {
		const notNegativeGuard = Guard.greaterThan(0, props.amount);

		if (!notNegativeGuard.succeeded) {
			Err(notNegativeGuard.succeeded!);
		}

		return Ok(new TransactionSend(props, id));
	}
}
