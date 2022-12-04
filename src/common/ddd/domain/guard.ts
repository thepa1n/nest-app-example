export class Guard {
  /**
   * Checks if value is empty. Accepts strings, numbers, booleans, objects and arrays.
   */
  static isEmpty(value: unknown): boolean {
    if (typeof value === 'number' || typeof value === 'boolean') {
      return false;
    }
    if (typeof value === 'undefined' || value === null) {
      return true;
    }
    if (value instanceof Date) {
      return false;
    }
    if (value instanceof Object && !Object.keys(value).length) {
      return true;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return true;
      }
      if (value.every((item) => Guard.isEmpty(item))) {
        return true;
      }
    }

    return value === '';
  }

  /**
   * Checks length range of a provided number/string/array
   */
  static lengthIsBetween(
    value: number | string | Array<unknown>,
    min: number,
    max: number,
  ): boolean {
    if (Guard.isEmpty(value)) {
      throw new Error(
        'Cannot check length of a value. Provided value is empty',
      );
    }
    const valueLength =
      typeof value === 'number'
        ? Number(value).toString().length
        : value.length;

    return valueLength >= min && valueLength <= max;
  }

  /**
   * Check is number string of a provided length
   */
  static isNumberStringWithLength(
    numberString: string,
    neededLength: number = 99999,
  ): boolean {
    return (
      /^\d+$/.test(numberString) &&
      Guard.lengthIsBetween(numberString, neededLength, neededLength)
    );
  }

  /**
   * Check if an array of objects has duplicates by object key
   */
  static checkDuplicatesInListOfObjects<T extends object>(
    listOfObjects: T[],
    key: keyof T,
  ): boolean {
    const seen = new Set();
    return listOfObjects.some(function (currentObject) {
      return seen.size === seen.add(currentObject[key]).size;
    });
  }
}