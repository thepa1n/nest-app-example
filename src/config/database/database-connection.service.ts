import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { CustomNamingStrategy } from './custom-naming-strategy.helper';
import { ApplicationConfigInterface } from '@config';

@Injectable()
export class DatabaseConnection implements TypeOrmOptionsFactory {
  constructor(
    private readonly configService: ConfigService<ApplicationConfigInterface>,
  ) {
    this.DATABASE_CONFIG = this.configService.get('DATABASE');
    this.IS_DEVELOPMENT = this.configService.get('IS_DEVELOPMENT');
    this.IS_LOCAL = this.configService.get('IS_LOCAL');
    this.ROOT_FOLDER_PATH = this.configService.get('ROOT_FOLDER_PATH');
  }

  private readonly DATABASE_CONFIG: ApplicationConfigInterface['DATABASE'];
  private readonly IS_DEVELOPMENT: ApplicationConfigInterface['IS_DEVELOPMENT'];
  private readonly IS_LOCAL: ApplicationConfigInterface['IS_LOCAL'];
  private readonly ROOT_FOLDER_PATH: ApplicationConfigInterface['ROOT_FOLDER_PATH'];

  createTypeOrmOptions(): TypeOrmModuleOptions {
    let extraSettings: { [key: string]: unknown } = {};

    if (this.DATABASE_CONFIG.SSL) {
      extraSettings = {
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }

    return {
      type: this.DATABASE_CONFIG.DIALECT,

      host: this.DATABASE_CONFIG.HOST,
      port: this.DATABASE_CONFIG.PORT,

      username: this.DATABASE_CONFIG.USER,
      password: this.DATABASE_CONFIG.PASSWORD,

      database: this.DATABASE_CONFIG.NAME,

      migrationsTableName: this.DATABASE_CONFIG.MIGRATIONS_TABLE_NAME,

      extra: {
        ...extraSettings,
        max: 100,
        connectionTimeoutMillis: 100000,
      },
      entities: [
        `${this.ROOT_FOLDER_PATH}/**/*.entity{.ts,.js}`,
        `${this.ROOT_FOLDER_PATH}/**/*.orm-entity{.ts,.js}`,
      ],
      namingStrategy: new CustomNamingStrategy(),

      logging: this.IS_DEVELOPMENT || this.IS_LOCAL,

      autoLoadEntities: true,
      synchronize: this.IS_DEVELOPMENT || this.IS_LOCAL,
    };
  }
}
