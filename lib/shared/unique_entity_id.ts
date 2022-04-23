import { v4 as uuid } from 'uuid';

/**
 * Add functionality to the identifiers as `UniqueEntityId`.
 */
export class Identifier<T> {
	constructor(private value: T) {
		this.value = value;
	}

	equals(id?: Identifier<T>): boolean {
		if (id === null || id === undefined) {
			return false;
		}
		if (!(id instanceof this.constructor)) {
			return false;
		}
		return id.toValue() === this.value;
	}

	toString() {
		return String(this.value);
	}

	/**
	 * Return raw value of identifier
	 */

	toValue(): T {
		return this.value;
	}
}

/**
 * Unique identifier or id used on the entities.
 */
export class UniqueEntityId extends Identifier<string | number> {
	constructor(id?: string | number) {
		super(id ? id : uuid());
	}
}
