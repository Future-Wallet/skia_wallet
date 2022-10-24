import { Error } from '@skiawallet/common';

/**
 * Fail to create an HDNode.
 */
export class ErrorWalletInvalidHdNode extends Error<string> {
  /**
   *
   * @param {string | null} data The phrase value.
   * @param {string | null} [message]
   */
  constructor(data: string | null, message?: string) {
    super(data, message);
  }

  toString(): string {
    return this.message ?? `${this.data}.`;
  }

  getClassName(): string {
    return ErrorWalletInvalidHdNode.name;
  }
}

/**
 * Fail to derive the HDNode.
 */
export class ErrorWalletInvalidDerivationOfHdNode extends Error<number> {
  /**
   *
   * @param {number | null} data The number of the derivation.
   * @param {string | null} [message]
   */
  constructor(data: number | null, message?: string) {
    super(data, message);
  }

  toString(): string {
    return this.message ?? `${this.data}.`;
  }

  getClassName(): string {
    return ErrorWalletInvalidDerivationOfHdNode.name;
  }
}

/**
 * Fail to get the convert mnemonic to hexadecimal.
 */
export class ErrorWalletConvertToMnemonicHexadecimal extends Error<string> {
  /**
   *
   * @param {string | null} data The string of the mnemonic phrase value.
   * @param {string | null} [message]
   */
  constructor(data: string | null, message?: string) {
    super(data, message);
  }

  toString(): string {
    return this.message ?? `${this.data}.`;
  }

  getClassName(): string {
    return ErrorWalletConvertToMnemonicHexadecimal.name;
  }
}
