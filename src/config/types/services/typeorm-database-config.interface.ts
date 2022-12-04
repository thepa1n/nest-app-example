import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export interface TypeormDatabaseConfigInterface {
  dbHost: string;
  dbName: string;
  dbPassword: string;
  dbPort: string;
  dbUser: string;
  ssl?: boolean;
  dbDialect: DatabaseDialects;
}

export enum DatabaseDialects {
  Postgres = 'postgres',
  Mysql = 'mysql',
}

export class DatabaseConfigSchema implements TypeormDatabaseConfigInterface {
  @IsEnum(DatabaseDialects)
  dbDialect: DatabaseDialects;

  @IsString()
  @IsNotEmpty()
  dbHost: string;

  @IsString()
  @IsNotEmpty()
  dbName: string;

  @IsString()
  @IsNotEmpty()
  dbPassword: string;

  @IsNumberString()
  @IsNotEmpty()
  dbPort: string;

  @IsString()
  @IsNotEmpty()
  dbUser: string;

  @IsOptional()
  @IsBoolean()
  ssl: boolean;
}
