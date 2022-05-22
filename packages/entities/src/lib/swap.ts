import { Err, Ok, Result } from 'ts-results';
import { Entity, Guard, UniqueEntityId } from '@skiawallet/common';

import { AccountAddress } from './account_address';
import { Token } from './tokens';

interface SwapProps {
  fromToken: Token;
  toToken: Token;
  amount: number;
  fromAddress: AccountAddress;
}

class Swap extends Entity<SwapProps> {
  get id(): UniqueEntityId {
    return this._id;
  }

  get fromToken(): Token {
    return this.props.fromToken;
  }
  get toToken(): Token {
    return this.props.toToken;
  }
  get amount(): number {
    return this.props.amount;
  }
  get fromAddress(): AccountAddress {
    return this.props.fromAddress;
  }

  private constructor(props: SwapProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public static create(
    props: SwapProps,
    id?: UniqueEntityId
  ): Result<Swap, string> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      {
        argument: props.fromToken,
        argumentName: 'fromToken',
      },
      {
        argument: props.toToken,
        argumentName: 'toToken',
      },
      { argument: props.amount, argumentName: 'amount' },
      { argument: props.fromAddress, argumentName: 'fromAddress' },
    ]);

    if (!nullGuard.succeeded) {
      return Err(nullGuard.message!);
    }

    return Ok(new Swap(props, id));
  }
}
