import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from '@nestjs/core';

import { UnitOfWorkModule } from '@infrastructure/database/unit-of-work/unit-of-work.module';
import { ApplicationConfigValidator } from '@config/validators';
import { DatabaseConnection } from '@config/database';
import { InitApplicationConfig } from '@config';
import {
  CustomerModule,
  GeneralClientModule,
} from '@modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [InitApplicationConfig],
      envFilePath: '.env',
      isGlobal: true,
      validate: ApplicationConfigValidator.validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DatabaseConnection,
    }),
    UnitOfWorkModule,
    GeneralClientModule,
    CustomerModule,
    RouterModule.register([
      {
        path: 'v1',
        children: [
          {
            path: 'customer',
            module: CustomerModule,
          },
          {
            path: 'general-client',
            module: GeneralClientModule,
          },
        ],
      },
    ]),
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}
