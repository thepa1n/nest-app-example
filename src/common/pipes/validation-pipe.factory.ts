import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { WrongRequestException } from '../exceptions';
import { LoggerPort } from '@common/ddd/domain/ports';

export class FrameworkValidationPipeMethods extends ValidationPipe {
  public flattenValidationErrors(
    validationErrors: ValidationError[],
  ): string[] {
    return super.flattenValidationErrors(validationErrors);
  }
}

export class ValidationPipeFactory {
  private static _methods: FrameworkValidationPipeMethods =
    new FrameworkValidationPipeMethods();

  static create(logger: LoggerPort, needShowDetails: boolean): ValidationPipe {
    return new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (
        validationErrors: ValidationError[],
      ): WrongRequestException => {
        const errorList =
          this._methods.flattenValidationErrors(validationErrors);

        logger.warn('Validation errors: ', { errorList });

        return new WrongRequestException(
          'Validation Error!',
          needShowDetails ? { errorList } : undefined,
        );
      },
    });
  }
}
