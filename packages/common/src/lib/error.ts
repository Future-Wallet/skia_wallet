/**
 * Parent class to be implemented on all kind of errors.
 */
export abstract class Error<T> {
  protected readonly data: T | null;
  protected readonly message: string | null;

  /**
   *
   * @param data
   * @param {string | null} [message]
   */
  constructor(data: T | null, message?: string | null) {
    this.data = data;
    this.message = message ?? null;
  }

  abstract toString(): string;

  /**
   * Gets the name of the class thanks to the property [`name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name). Eg. `CustomError.name`.
   */
  abstract getClassName(): string;
}
