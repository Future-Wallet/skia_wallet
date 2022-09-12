import { Error } from '@skiawallet/common';
import { generateMnemonic, wordlists } from 'bip39';
import { Result } from 'ts-results';
import { Mnemonic, MnemonicLocale } from './mnemonic';
import {
  ErrorMnemonicInvalidNumberOfWords,
  ErrorMnemonicWordUnsupported,
} from './mnemonic_errors';

describe.only('entity Mnemonic', () => {
  let phrase: string;
  let result: Result<Mnemonic, Error<string>[]>;
  let resultVal: Mnemonic;
  let typeOfErrors: string[];
  /**
   * Number of words by the entropy length.
   */
  const numberOfWordsByStrengh = {
    12: 128,
    15: 160,
    18: 192,
    21: 224,
    24: 256,
  };

  test('get properties: value, locale and words counter', () => {
    // Phrase of 12 words.
    phrase = generateMnemonic(
      numberOfWordsByStrengh[12],
      undefined,
      wordlists['english']
    );
    result = Mnemonic.create({ value: phrase, locale: MnemonicLocale.en });

    resultVal = result.val as Mnemonic;
    expect(resultVal.value).toEqual(phrase);
    expect(resultVal.locale).toEqual(MnemonicLocale.en);
    expect(resultVal.wordsCounter).toEqual(12);
  });

  test.concurrent.each([12, 15, 18, 21, 24])(
    'creates the mnemonic from %d english words',
    (words) => {
      phrase = generateMnemonic(
        numberOfWordsByStrengh[(words as 12, 15, 18, 21, 24)]
      );
      result = Mnemonic.create({
        value: phrase,
        locale: MnemonicLocale.en,
      });
      expect(result.ok).toBeTruthy;
    }
  );

  test.concurrent.each([
    MnemonicLocale.cs,
    MnemonicLocale.en,
    MnemonicLocale.es,
    MnemonicLocale.fr,
    MnemonicLocale.it,
    MnemonicLocale.ja,
    MnemonicLocale.ko,
    MnemonicLocale.pt,
    MnemonicLocale.zh,
    MnemonicLocale.zh_t,
  ])('creates the mnemonic for %s', (locale) => {
    phrase = generateMnemonic(
      numberOfWordsByStrengh[24],
      undefined,
      wordlists[locale]
    );
    result = Mnemonic.create({
      value: phrase,
      locale: locale,
    });
    resultVal = result.val as Mnemonic;
    expect(result.ok).toBeTruthy;
    expect(resultVal.value as string).toEqual(phrase);
    expect(resultVal.locale).toEqual(locale);
  });

  it('returns error for all or some unsupported words', () => {
    phrase =
      'words click shoe duty fabric bachelor village clutch palm way penalty gas cancel primary airport chase brick anger snow tiny fan doctor fish unsupported';
    result = Mnemonic.create({
      value: phrase,
      locale: MnemonicLocale.en,
    });
    typeOfErrors = (result.val as Error<string>[]).map((err) =>
      err.getClassName()
    );

    expect(result.err).toBeTruthy;
    expect(expect.arrayContaining(typeOfErrors)).toEqual([
      ErrorMnemonicWordUnsupported.name,
      ErrorMnemonicWordUnsupported.name,
    ]);

    // Errors return the incorrect words.
    expect((result.val as Error<string>[])[0].data).toEqual('words');
    expect((result.val as Error<string>[])[1].data).toEqual('unsupported');
  });

  test('returns error for invalid number of words', () => {
    // 23 words
    phrase =
      'such illegal you win local invest pudding alien gasp fly crop elegant odor claw injury mom wrong source seven client angle reunion flame';
    result = Mnemonic.create({
      value: phrase,
      locale: MnemonicLocale.en,
    });
    typeOfErrors = (result.val as Error<string>[]).map((err) =>
      err.getClassName()
    );

    expect(result.err).toBeTruthy;
    expect(expect.arrayContaining(typeOfErrors)).toEqual([
      ErrorMnemonicInvalidNumberOfWords.name,
    ]);
    // Error return the invalid number of words.
    expect((result.val as Error<string>[])[0].data).toEqual('23');
  });
});
