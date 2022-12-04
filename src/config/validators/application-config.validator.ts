import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import {
  plainToClass,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';

import { FrameworkValidationPipeMethods } from '@common/pipes';
import {
  AppEnvironment,
  ConfigFromProcessEnvInterface,
  RmqPublisherEnvironmentValidationSchema,
  RabbitMqValidationSchema,
  DatabaseConfigSchema,
} from '@config';

class ApplicationEnvironmentSchema implements ConfigFromProcessEnvInterface {
  @IsEnum(AppEnvironment)
  NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  APPLICATION_NAME: string;

  @IsPositive()
  @IsNotEmpty()
  PORT: number;

  @ValidateNested()
  @Transform((dbConfig) =>
    plainToInstance(DatabaseConfigSchema, JSON.parse(dbConfig.value)),
  )
  @Type(() => DatabaseConfigSchema)
  @IsNotEmpty()
  DB_CONFIG: DatabaseConfigSchema;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  TIME_ZONE: string;

  @IsOptional()
  @IsPositive()
  @IsNotEmpty()
  UPLOAD_CONCURRENCY: number;

  @ValidateNested()
  @Transform((rmqConfig) =>
    plainToInstance(RabbitMqValidationSchema, JSON.parse(rmqConfig.value)),
  )
  @Type(() => RabbitMqValidationSchema)
  @IsNotEmpty()
  RMQ_CONFIG: RabbitMqValidationSchema;

  @ValidateNested()
  @Transform((rmqConfig) =>
    plainToInstance(
      RmqPublisherEnvironmentValidationSchema,
      JSON.parse(rmqConfig.value),
    ),
  )
  @Type(() => RmqPublisherEnvironmentValidationSchema)
  @IsNotEmpty()
  AUDIT_LOG_MODULE: RmqPublisherEnvironmentValidationSchema;
}

export class ApplicationConfigValidator {
  static validate(config: Record<string, unknown>): Record<string, unknown> {
    const validatedConfig = plainToClass(ApplicationEnvironmentSchema, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(
        'Application configuration is wrong! Details: ' +
          JSON.stringify(
            new FrameworkValidationPipeMethods().flattenValidationErrors(
              errors,
            ),
          ),
      );
    }

    return config;
  }
}
