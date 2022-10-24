import { Ok, Result } from 'ts-results';
import { Entity, UniqueEntityId } from '@skiawallet/common';

import { Address } from './address';
import { Token } from './tokens';

interface SwapProps {
  fromToken: Token;
  toToken: Token;
  amount: number;
  fromAddress: Address;
}

export class Swap extends Entity<SwapProps> {
  get id(): UniqueEntityId | undefined {
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
  get fromAddress(): Address {
    return this.props.fromAddress;
  }

  private constructor(props: SwapProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public static create(
    props: SwapProps,
    id?: UniqueEntityId
  ): Result<Swap, string> {
    return Ok(new Swap(props, id));
  }
}
