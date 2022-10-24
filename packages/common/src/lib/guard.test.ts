import { Error } from './error';
import {
  ErrorAddressDoesntStartWith0x,
  ErrorAddressLessThan42Characters,
  ErrorAddressGreaterThan42Characters,
  ErrorAddressNotHexadecimal,
  ErrorAddressInvalidChecksum,
} from './guard_error';
import { Guard, GuardManyResults } from './guard';

describe('class Guard', () => {
  describe('isAnEvmAddress()', () => {
    let address: string;
    let result: GuardManyResults<string>;
    let typeOfErrors: string[];

    it(`approves '0xa9d48F598d7A573d840F318f40d77D5a50908c18'`, () => {
      address = '0xa9d48F598d7A573d840F318f40d77D5a50908c18';
      result = Guard.isAnEvmAddress(address);

      expect(result.ok).toBeTruthy();
    });

    it(`disapproves 'random_characters'`, () => {
      address = 'random_characters';
      result = Guard.isAnEvmAddress(address);
      typeOfErrors = (result.val as Error<string>[]).map((err) =>
        err.getClassName()
      );

      expect(result.err).toBeTruthy();
      expect(expect.arrayContaining(typeOfErrors)).toEqual([
        ErrorAddressDoesntStartWith0x.name,
        ErrorAddressLessThan42Characters.name,
        ErrorAddressNotHexadecimal.name,
      ]);
    });

    it(`disapproves '1234'`, () => {
      address = '1234';
      result = Guard.isAnEvmAddress(address);
      typeOfErrors = (result.val as Error<string>[]).map((err) =>
        err.getClassName()
      );

      expect(result.err).toBeTruthy;
      expect(expect.arrayContaining(typeOfErrors)).toEqual([
        ErrorAddressDoesntStartWith0x.name,
        ErrorAddressLessThan42Characters.name,
        ErrorAddressNotHexadecimal.name,
      ]);
    });

    it(`disapproves '123456789012345678901234567890123456789012'`, () => {
      address = '123456789012345678901234567890123456789012';
      result = Guard.isAnEvmAddress(address);
      typeOfErrors = (result.val as Error<string>[]).map((err) =>
        err.getClassName()
      );

      expect(result.err).toBeTruthy;
      expect(expect.arrayContaining(typeOfErrors)).toEqual([
        ErrorAddressDoesntStartWith0x.name,
        ErrorAddressGreaterThan42Characters.name,
        ErrorAddressNotHexadecimal.name,
      ]);
    });

    it(`disapproves '0x1234'`, () => {
      address = '0x1234';
      result = Guard.isAnEvmAddress(address);
      typeOfErrors = (result.val as Error<string>[]).map((err) =>
        err.getClassName()
      );

      expect(result.err).toBeTruthy;
      expect(expect.arrayContaining(typeOfErrors)).toEqual([
        ErrorAddressLessThan42Characters.name,
        ErrorAddressNotHexadecimal.name,
      ]);
    });

    it(`disapproves '0x12345678901234567890123456789012345678901234567890'`, () => {
      address = '0x12345678901234567890123456789012345678901234567890';
      result = Guard.isAnEvmAddress(address);
      typeOfErrors = (result.val as Error<string>[]).map((err) =>
        err.getClassName()
      );

      expect(result.err).toBeTruthy;
      expect(expect.arrayContaining(typeOfErrors)).toEqual([
        ErrorAddressGreaterThan42Characters.name,
        ErrorAddressLessThan42Characters.name,
      ]);
    });

    it(`disapproves '0xzzzz567890123456789012345678901234567890'`, () => {
      address = '0xzzzz567890123456789012345678901234567890';
      result = Guard.isAnEvmAddress(address);
      typeOfErrors = (result.val as Error<string>[]).map((err) =>
        err.getClassName()
      );

      expect(result.err).toBeTruthy;
      expect(expect.arrayContaining(typeOfErrors)).toEqual([
        ErrorAddressNotHexadecimal.name,
      ]);
    });

    it(`approves a right checksum address '0xa54d3c09E34aC96807c1CC397404bF2B98DC4eFb'`, () => {
      address = '0xa54d3c09E34aC96807c1CC397404bF2B98DC4eFb';
      result = Guard.isAnEvmAddress(address);

      expect(result.ok).toBeTruthy;
    });

    it(`disapproves a wrong checksum address '0xa54D3c09E34aC96807c1CC397404bF2B98DC4eFb'`, () => {
      address = '0xa54D3c09E34aC96807c1CC397404bF2B98DC4eFb';
      result = Guard.isAnEvmAddress(address);
      typeOfErrors = (result.val as Error<string>[]).map((err) =>
        err.getClassName()
      );

      expect(result.err).toBeTruthy;
      expect(expect.arrayContaining(typeOfErrors)).toEqual([
        ErrorAddressInvalidChecksum.name,
      ]);
    });
  });
});
