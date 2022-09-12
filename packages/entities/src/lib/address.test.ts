import { Error } from '@skiawallet/common';
import { Result } from 'ts-results';
import { Address } from './address';

describe('value object Address', () => {
  let address: string;
  let result: Result<Address, Error<string>[]>;

  it(`creates address '0xa9d48F598d7A573d840F318f40d77D5a50908c18'`, () => {
    address = '0xa9d48F598d7A573d840F318f40d77D5a50908c18';
    result = Address.create(address);

    expect(result.ok).toBeTruthy;
    expect(address).toEqual((result.val as Address).value);
  });

  it(`get error when create address '0x123'`, () => {
    address = '0x123';
    result = Address.create(address);

    expect(result.err).toBeTruthy;
    expect(result.val as Error<string>[]).toBeTruthy;
  });
});
