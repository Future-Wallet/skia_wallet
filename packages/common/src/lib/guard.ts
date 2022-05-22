export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

// TODO: create test that always return message when the validation is incorrect.
// TODO: translate error messages.
/**
 * Multiple methods to verify data.
 */
export class Guard {
  public static greaterThan(
    minValue: number,
    actualValue: number
  ): IGuardResult {
    return actualValue > minValue
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `Number given {${actualValue}} is not greater than {${minValue}}`,
        };
  }

  public static againstAtLeast(numChars: number, text: string): IGuardResult {
    return text.length >= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `Text is not at least ${numChars} chars.`,
        };
  }

  public static againstAtMost(numChars: number, text: string): IGuardResult {
    return text.length <= numChars
      ? { succeeded: true }
      : {
          succeeded: false,
          message: `Text is greater than ${numChars} chars.`,
        };
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string
  ): IGuardResult {
    if (argument === null || argument === undefined) {
      return {
        succeeded: false,
        message: `${argumentName} is null or undefined`,
      };
    } else {
      return { succeeded: true };
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): IGuardResult {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName
      );
      if (!result.succeeded) return result;
    }
    return { succeeded: true };
  }

  /**
   *
   * IMPORTANT: Error message
   * @param address
   * @returns
   */
  public static isAnEVMAddress(address: string): IGuardResult {
    const section_one = address.slice(0, 1);
    const section_two = address.slice(2);
    let errorMessages: string[] = [`Address ${address}.`];

    if (section_one != '0x') {
      errorMessages.push(`Address must start with 0x.`);
    }
    if (section_two.length != 40) {
      errorMessages.push(
        `Address must have 40 characters instead of ${section_two.length}.`
      );
    }

    // If there aren't error messages, it means the address is correct.
    if (errorMessages.length == 1) {
      return { succeeded: true };
    }

    return {
      succeeded: false,
      message: errorMessages.join(' '),
    };
  }

  // public static combine(guardResults: IGuardResult[]): IGuardResult {
  // 	for (let result of guardResults) {
  // 		if (result.succeeded === false) return result;
  // 	}

  // 	return { succeeded: true };
  // }
}
