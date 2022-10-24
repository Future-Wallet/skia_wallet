import { Err, Ok, Result } from 'ts-results';
import { EntityProps, Error, Guard, ValueObject } from '@skiawallet/common';

interface AddressProps extends EntityProps {
  value: string;
}

export class Address extends ValueObject<AddressProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: AddressProps) {
    super(props);
  }

  public static create(data: string): Result<Address, Error<string>[]> {
    const isAnAddress = Guard.isAnEvmAddress(data);

    return isAnAddress.ok
      ? Ok(new Address({ value: data }))
      : Err(isAnAddress.val);
  }
}
