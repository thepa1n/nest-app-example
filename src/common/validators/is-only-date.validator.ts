import moment from 'moment';
import {
  buildMessage,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function IsOnlyDate(validationOptions?: ValidationOptions): Function {
  let isInvalidDateError: boolean;
  let isRegexpError: boolean;
  let isNotStringError: boolean;

  return (object: Object, propertyName: string): void => {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          try {
            const regex = /^[1-9]\d*-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

            if (typeof value !== 'string') {
              isNotStringError = true;
              return false;
            } else if (!regex.test(value)) {
              isRegexpError = true;
              return false;
            } else if (!moment(value, 'YYYY-MM-DD').isValid()) {
              isInvalidDateError = true;
              return false;
            }

            return true;
          } catch (e) {
            return false;
          }
        },
        defaultMessage: buildMessage((eachPrefix) => {
          if (isInvalidDateError) {
            return (
              eachPrefix +
              '$property must be a valid date! (example 2020-12-08)'
            );
          } else if (isRegexpError) {
            return (
              eachPrefix +
              '$property must be a valid date format YYYY-MM-DD (example 2020-12-08)!'
            );
          } else if (isNotStringError) {
            return (
              eachPrefix +
              '$property must be a valid date string of format YYYY-MM-DD (example 2020-12-08)!'
            );
          }

          return eachPrefix + 'Please provide valid date only like 2020-12-08';
        }, validationOptions),
      },
    });
  };
}
