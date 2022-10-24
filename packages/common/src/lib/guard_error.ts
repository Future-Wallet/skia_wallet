import { Error } from './error';

export class ErrorAddressDoesntStartWith0x extends Error<string> {
  /**
   *
   * @param {string | null} data The address
   * @param {string | null} [message]
   */
  constructor(data: string | null, message?: string) {
    super(data, message);
  }

  toString(): string {
    return this.message ?? `The address ${this.data} doesn't start with '0x'.`;
  }

  getClassName(): string {
    return ErrorAddressDoesntStartWith0x.name;
  }
}

export class ErrorAddressLessThan42Characters extends Error<string> {
  /**
   *
   * @param {string | null} data The address
   * @param {string | null} [message]
   */
  constructor(data: string | null, message?: string) {
    super(data, message);
  }

  toString(): string {
    return (
      this.message ??
      `The address ${this.data} contains less than 42 characters.`
    );
  }

  getClassName(): string {
    return ErrorAddressLessThan42Characters.name;
  }
}
export class ErrorAddressGreaterThan42Characters extends Error<string> {
  /**
   *
   * @param {string | null} data The address
   * @param {string | null} [message]
   */
  constructor(data: string | null, message?: string) {
    super(data, message);
  }

  toString(): string {
    return (
      this.message ??
      `The address ${this.data} contains more than 42 characters.`
    );
  }

  getClassName(): string {
    return ErrorAddressGreaterThan42Characters.name;
  }
}

export class ErrorAddressInvalidChecksum extends Error<string> {
  /**
   *
   * @param {string | null} data The address
   * @param {string | null} [message]
   */
  constructor(data: string | null, message?: string) {
    super(data, message);
  }

  toString(): string {
    return this.message ?? `The address ${this.data} has an invalid checksum.`;
  }

  getClassName(): string {
    return ErrorAddressInvalidChecksum.name;
  }
}

export class ErrorAddressNotHexadecimal extends Error<string> {
  /**
   *
   * @param {string | null} data The address
   * @param {string | null} [message]
   */
  constructor(data: string | null, message?: string) {
    super(data, message);
  }

  toString(): string {
    return (
      this.message ??
      `The address ${this.data} isn't an hexadecimal value (0x, 0-->9, a-->f and A-->F).`
    );
  }

  getClassName(): string {
    return ErrorAddressNotHexadecimal.name;
  }
}
