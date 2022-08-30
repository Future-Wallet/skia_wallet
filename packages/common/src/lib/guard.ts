import { arrayify, keccak256 } from 'ethers/lib/utils';
import { Err, Ok, Result } from 'ts-results';

import { Error } from './error';
import {
  ErrorAddressDoesntStartWith0x,
  ErrorAddressGreaterThan42Characters,
  ErrorAddressInvalidChecksum,
  ErrorAddressLessThan42Characters,
  ErrorAddressNotHexadecimal,
} from './error_address';

export type GuardResult<T> = Result<GuardResponse, Error<T>>;
export type GuardManyResults<T> = Result<GuardResponse, Error<T>[]>;

export type GuardResponse = string | undefined;

/**
 * Multiple utilities to verify if the data is correct.
 */
export class Guard {
  /**
   * Check if is an EVM address (including the checksum address)
   *
   * Code copied from [EtherJS](https://github.com/ethers-io/ethers.js/blob/01b5badbb616b29fd8b69ef7c3cc3833062da3d7/packages/address/src.ts/index.ts#L77).
   *
   * @param address
   * @returns
   */
  public static isAnEvmAddress(address: string): GuardManyResults<string> {
    const errors: Error<string>[] = [];

    // Missing the 0x prefix
    if (address.slice(0, 2) != '0x') {
      errors.push(new ErrorAddressDoesntStartWith0x(address));
    }

    if (!isHexString(address)) {
      errors.push(new ErrorAddressNotHexadecimal(address));
    }

    if (address.length < 42) {
      errors.push(new ErrorAddressLessThan42Characters(address));
    } else if (address.length > 42) {
      errors.push(new ErrorAddressGreaterThan42Characters(address));
    } else {
      // // Missing the 0x prefix
      // if (address.substring(0, 2) !== '0x') {
      //   address = '0x' + address;
      // }

      const result = getChecksumAddress(address);

      if (typeof result !== 'string') {
        errors.push(result);
      } else {
        // It's a checksummed address with a bad checksum
        if (
          address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) &&
          result !== address
        ) {
          errors.push(new ErrorAddressInvalidChecksum(address));
        }
      }
    }

    // If there aren't error messages, it means the address is correct.
    if (errors.length == 0) {
      return Ok(address);
    }

    return Err(errors);
  }

  // public static againstNullOrUndefined(
  //   argument: any,
  //   argumentName: string
  // ): IGuardResult<any> {
  //   if (argument === null || argument === undefined) {
  //     return {
  //       succeeded: false,
  //       error: `${argumentName} is null or undefined`,
  //     };
  //   } else {
  //     return { succeeded: true };
  //   }
  // }

  // public static againstNullOrUndefinedBulk(
  //   args: GuardArgumentCollection
  // ): IGuardResult<GuardArgumentCollection> {
  //   for (const arg of args) {
  //     const result = Guard.againstNullOrUndefined(
  //       arg.argument,
  //       arg.argumentName
  //     );
  //     if (!result.succeeded) return result;
  //   }
  //   return { succeeded: true };
  // }

  // public static greaterThan(
  //   minValue: number,
  //   actualValue: number
  // ): IGuardResult {
  //   return actualValue > minValue
  //     ? { succeeded: true }
  //     : {
  //         succeeded: false,
  //         message: `Number given {${actualValue}} is not greater than {${minValue}}`,
  //       };
  // }

  // public static againstAtLeast(numChars: number, text: string): IGuardResult {
  //   return text.length >= numChars
  //     ? { succeeded: true }
  //     : {
  //         succeeded: false,
  //         message: `Text is not at least ${numChars} chars.`,
  //       };
  // }

  // public static againstAtMost(numChars: number, text: string): IGuardResult {
  //   return text.length <= numChars
  //     ? { succeeded: true }
  //     : {
  //         succeeded: false,
  //         message: `Text is greater than ${numChars} chars.`,
  //       };
  // }

  // public static combine(guardResults: IGuardResult[]): IGuardResult {
  // 	for (let result of guardResults) {
  // 		if (result.succeeded === false) return result;
  // 	}
  // 	return { succeeded: true };
  // }
}

/**
 * Get the checksum of the address.
 *
 * Copied from [EtherJS](https://github.com/ethers-io/ethers.js/blob/01b5badbb616b29fd8b69ef7c3cc3833062da3d7/packages/address/src.ts/index.ts#L12)
 *
 * @param address
 * @returns
 */
function getChecksumAddress(address: string): string | Error<string> {
  if (!isHexString(address, 20)) {
    return new ErrorAddressNotHexadecimal(address);
  }

  address = address.toLowerCase();

  const chars = address.substring(2).split('');

  const expanded = new Uint8Array(40);
  for (let i = 0; i < 40; i++) {
    expanded[i] = chars[i].charCodeAt(0);
  }

  const hashed = arrayify(keccak256(expanded));

  for (let i = 0; i < 40; i += 2) {
    if (hashed[i >> 1] >> 4 >= 8) {
      chars[i] = chars[i].toUpperCase();
    }
    if ((hashed[i >> 1] & 0x0f) >= 8) {
      chars[i + 1] = chars[i + 1].toUpperCase();
    }
  }

  return '0x' + chars.join('');
}

/**
 * Check if the value is an hexadecimal.
 *
 * Code copied from [EtherJS](https://github.com/ethers-io/ethers.js/blob/01b5badbb616b29fd8b69ef7c3cc3833062da3d7/packages/bytes/src.ts/index.ts#L188).
 *
 * @param value
 * @param length
 * @returns
 */
function isHexString(value: string, length?: number): boolean {
  if (!value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}
