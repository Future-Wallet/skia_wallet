import { Err, Ok, Result } from 'ts-results';
import { Entity } from '../shared/entity';
import { Guard } from '../shared/guard';
import { UniqueEntityId } from '../shared/unique_entity_id';

export interface TransactionReceiveProps {
	address: string;
	amount: number;
}

export class TransactionReceive extends Entity<TransactionReceiveProps> {
	get id(): UniqueEntityId {
		return this._id;
	}

	get address(): string {
		return this.props.address;
	}

	private constructor(props: TransactionReceiveProps, id?: UniqueEntityId) {
		super(props, id);
	}

	public static create(
		props: TransactionReceiveProps,
		id?: UniqueEntityId
	): Result<TransactionReceive, string> {
		const notNegativeGuard = Guard.greaterThan(0, props.amount);

		if (!notNegativeGuard.succeeded) {
			Err(notNegativeGuard.succeeded!);
		}

		return Ok(new TransactionReceive(props, id));
	}
}
