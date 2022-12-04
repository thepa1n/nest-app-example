import { TypeormDatabaseConfigInterface } from '@config';

export interface ConfigFromProcessEnvInterface {
  NODE_ENV: string;
  APPLICATION_NAME: string;
  DB_CONFIG: TypeormDatabaseConfigInterface;
  TIME_ZONE: string;
  PORT: number;
  UPLOAD_CONCURRENCY: number;
}
