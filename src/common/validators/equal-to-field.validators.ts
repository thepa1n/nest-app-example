import { ClassConstructor } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const ShouldEqual =
  <T>(
    type: ClassConstructor<T>,
    property: (o: T) => unknown,
    validationOptions?: ValidationOptions,
  ) =>
  (object: unknown, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ShouldEqualConstraint,
    });
  };

export const ShouldNotEqual =
  <T>(
    type: ClassConstructor<T>,
    property: (o: T) => unknown,
    validationOptions?: ValidationOptions,
  ) =>
  (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ShouldNotEqualConstraint,
    });
  };

@ValidatorConstraint({ name: 'ShouldEqual' })
export class ShouldEqualConstraint implements ValidatorConstraintInterface {
  public validate(value: unknown, args: ValidationArguments): boolean {
    const [fn] = args.constraints;

    return fn(args.object) === value;
  }

  public defaultMessage(args: ValidationArguments): string {
    const [constraintProperty]: (() => unknown)[] = args.constraints;
    const fieldName = constraintProperty.toString().split('.').pop();

    return `${fieldName || constraintProperty} and ${
      args.property
    } should be equal!`;
  }
}

@ValidatorConstraint({ name: 'ShouldNotEqual' })
export class ShouldNotEqualConstraint implements ValidatorConstraintInterface {
  public validate(value: unknown, args: ValidationArguments): boolean {
    const [fn] = args.constraints;
    return fn(args.object) !== value;
  }

  public defaultMessage(args: ValidationArguments): string {
    const [constraintProperty]: (() => unknown)[] = args.constraints;
    const fieldName = constraintProperty.toString().split('.').pop();

    return `${fieldName || constraintProperty} and ${
      args.property
    } should not be equal!`;
  }
}
