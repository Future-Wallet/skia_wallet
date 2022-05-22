import { Result, Ok, Err } from 'ts-results';
import { Entity, Guard, UniqueEntityId } from '@skiawallet/common';

import { AccountAddress } from './account_address';

export interface AccountProps {
  email: string;
  password: string;
  publicAddress: AccountAddress;
}

export class Account extends Entity<AccountProps> {
  /**
   * The identifier is the same as the public address of the account.
   */
  get id(): UniqueEntityId {
    return this._id;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get publicAddress(): AccountAddress {
    return this.props.publicAddress;
  }

  private constructor(props: AccountProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public static create(
    props: AccountProps,
    id?: UniqueEntityId
  ): Result<Account, string> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.email, argumentName: 'email' },
      { argument: props.password, argumentName: 'password' },
    ]);

    if (!nullGuard.succeeded) {
      return Err(nullGuard.message!);
    }

    return Ok<Account>(new Account(props, id));
  }
}
