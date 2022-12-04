import { ClassConstructor } from 'class-transformer/types/interfaces';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { WrongRequestException } from '@common/exceptions';
import { FrameworkValidationPipeMethods } from '@common/pipes';
import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';

export async function validatePlainObjectValidator({
  validationSchema,
  objectToValidate,
  throwException,
  validatorOptions,
}: {
  validationSchema: ClassConstructor<object>;
  objectToValidate: object;
  throwException?: boolean;
  validatorOptions?: ValidatorOptions;
}): Promise<string[]> {
  const toValidate = plainToInstance(validationSchema, objectToValidate, {
    enableImplicitConversion: true,
  });

  const validationErrors = await validate(
    toValidate,
    validatorOptions || {
      skipMissingProperties: false,
    },
  );

  const errorList =
    new FrameworkValidationPipeMethods().flattenValidationErrors(
      validationErrors,
    );

  if (throwException && validationErrors?.length) {
    throw new WrongRequestException('Validation Error!', { errorList });
  }

  return errorList;
}
