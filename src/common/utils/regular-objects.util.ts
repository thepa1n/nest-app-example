import { ObjectLiteral } from '../types';

export class RegularObjectsUtil {
  /**
   * Remove undefined properties from an object
   */
  static removeUndefinedProps(item: object): ObjectLiteral {
    const filtered: ObjectLiteral = {};
    for (const key of Object.keys(item)) {
      if (item[key]) filtered[key] = item[key];
    }
    return filtered;
  }
}
