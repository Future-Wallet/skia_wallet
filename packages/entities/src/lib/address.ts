import { Err, Ok, Result } from 'ts-results';
import { Error, Guard, ValueObject } from '@skiawallet/common';

interface AddressProps {
  value: string;
}

export class Address extends ValueObject<AddressProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: AddressProps) {
    super(props);
  }

  public static create(props: AddressProps): Result<Address, Error<string>[]> {
    const isAnAddress = Guard.isAnEvmAddress(props.value);

    return isAnAddress.ok ? Ok(new Address(props)) : Err(isAnAddress.val);
  }
}
