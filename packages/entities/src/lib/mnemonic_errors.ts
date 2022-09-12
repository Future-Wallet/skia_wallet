import { Error } from '@skiawallet/common';

/**
 * The mnemonic doesn't have 12, 15, 18, 21 or 24 words.
 */
export class ErrorMnemonicInvalidNumberOfWords extends Error<string> {
  /**
   *
   * @param {string | null} data Then number of words.
   * @param {string | null} [phrase] Phrase with the error.
   */
  constructor(data: string | null, phrase?: string) {
    super(data, phrase);
  }

  toString(): string {
    return this.message ?? `${this.data}.`;
  }

  getClassName(): string {
    return ErrorMnemonicInvalidNumberOfWords.name;
  }
}

/**
 * Word isn't supported.
 */
export class ErrorMnemonicWordUnsupported extends Error<string> {
  /**
   *
   * @param {string | null} data The mnemonic value.
   * @param {string | null} [phrase] Phrase with the error.
   */
  constructor(data: string | null, phrase?: string) {
    super(data, phrase);
  }

  toString(): string {
    return this.message ?? `${this.data}.`;
  }

  getClassName(): string {
    return ErrorMnemonicWordUnsupported.name;
  }
}
