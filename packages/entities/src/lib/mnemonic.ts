import { Entity, Error } from '@skiawallet/common';
import * as bip39 from 'bip39';
import { Err, Ok, Result } from 'ts-results';
import * as dompurify from 'dompurify';

import {
  ErrorMnemonicInvalidNumberOfWords,
  ErrorMnemonicWordUnsupported,
} from './mnemonic_errors';

/**
 * Ten languages supported by [BIP39](https://github.com/bitcoinjs/bip39).
 *
 * Read the list on [BIP39's code](https://github.com/bitcoinjs/bip39/tree/d527196f6f/ts_src/wordlists).
 */
export enum MnemonicLocale {
  /** Czech */
  cs = 'czech',
  /** English */
  en = 'english',
  /** Spanish */
  es = 'spanish',
  /** French */
  fr = 'french',
  /** Italian */
  it = 'italian',
  /** Japanese */
  ja = 'japanese',
  /** Korean */
  ko = 'korean',
  /** Portuguese */
  pt = 'portuguese',
  /** Chinese simplified */
  zh = 'chinese_simplified',
  /** Chinese traditional */
  zh_t = 'chinese_traditional',
}

export type MnemonicProps = {
  value: string;
  locale: MnemonicLocale;
  wordsCounter: number;
};

export type MnemonicParameters = {
  locale: MnemonicLocale;
  value?: string;
};
/**
 * Mnemonic is a phrase of 12, 15, 18, 21 or 24 words in one of 9 languages.
 *
 * Read more on [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) and about the [languages it supports](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md).
 */
export class Mnemonic extends Entity<MnemonicProps> {
  private constructor(props: MnemonicProps) {
    super(props);
  }

  /**
   * The full phrase of words.
   */
  get value(): string {
    return this.props.value;
  }

  get locale(): MnemonicLocale {
    return this.props.locale;
  }

  get wordsCounter(): number {
    return this.props.wordsCounter;
  }

  public static create({
    value,
    locale,
  }: MnemonicParameters): Result<Mnemonic, Error<string>[]> {
    const errors: Error<string>[] = [];
    // Japanese needs two ideographic spaces according to [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md#japanese).
    const seperator = locale == MnemonicLocale.ja ? '\u3000' : ' ';

    // When the phrase is provided.
    if (value != undefined) {
      // Sanitize value and delete extra spaces.
      const cleanedPhrase = dompurify
        .sanitize(value)
        // Japanese needs two ideographic spaces according to [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md#japanese).
        .replace(/\s+/g, seperator)
        .trim();

      const wordsCounter = cleanedPhrase.trim().split(/\s+/).length;

      // Check number of words
      if (
        wordsCounter != 12 &&
        wordsCounter != 15 &&
        wordsCounter != 18 &&
        wordsCounter != 21 &&
        wordsCounter != 24
      ) {
        errors.push(
          new ErrorMnemonicInvalidNumberOfWords(
            wordsCounter.toString(),
            cleanedPhrase
          )
        );
      }

      // Check if each word is supported.
      cleanedPhrase.split(seperator).forEach((word) => {
        const found = bip39.wordlists[
          Mnemonic.convertLocaleToBip39Locale(locale)
        ].find((supportedWord) => supportedWord == word);
        if (found === undefined) {
          errors.push(new ErrorMnemonicWordUnsupported(word));
        }
      });

      if (errors.length >= 1) return Err(errors);

      return Ok(
        new Mnemonic({
          value: cleanedPhrase,
          wordsCounter: wordsCounter,
          locale: locale,
        })
      );
    }
    // When it needs to self-generate the mnemonic
    else {
      const phrase = Mnemonic.generatePhrase(locale);

      return Ok(
        new Mnemonic({ value: phrase, locale: locale, wordsCounter: 24 })
      );
    }
  }

  /**
   * Generate a mnemonic based on the language choosen.
   *
   * @param {MnemonicLocale} locale
   * @returns
   */
  private static generatePhrase(locale: MnemonicLocale): string {
    // Create a phrase of 24 words, equal to 256 of the entropy length)
    return bip39.generateMnemonic(
      256,
      undefined,
      bip39.wordlists[Mnemonic.convertLocaleToBip39Locale(locale)]
    );
  }

  /**
   * The languages supported by BIP39 are on [this list](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md).
   *
   * @param {MnemonicLocale} locale
   * @returns Language's full name adapted for BIP39.
   */
  private static convertLocaleToBip39Locale(locale: MnemonicLocale) {
    switch (locale) {
      case MnemonicLocale.cs:
        return 'czech';

      case MnemonicLocale.en:
        return 'english';

      case MnemonicLocale.es:
        return 'spanish';

      case MnemonicLocale.fr:
        return 'french';

      case MnemonicLocale.it:
        return 'italian';

      case MnemonicLocale.ja:
        return 'japanese';

      case MnemonicLocale.ko:
        return 'korean';

      case MnemonicLocale.pt:
        return 'portuguese';

      case MnemonicLocale.zh:
        return 'chinese_simplified';

      case MnemonicLocale.zh_t:
        return 'chinese_traditional';
    }
  }
}
