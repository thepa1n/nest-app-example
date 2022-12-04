import {
  IRMQPublisherSettings,
  IRMQConsumerSettings,
} from '../../infrastructure/rabbitmq-module/types';

export interface ApplicationConfigInterface {
  SERVER_PORT: number;
  NODE_ENV: string;
  APP_VERSION: string;

  APP_NAME: string;
  APP_IDENTIFIER: string;
  APP_TIME_ZONE: string;
  SENSITIVE_DATA_LIST: string[];

  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
  IS_LOCAL: boolean;

  ROOT_FOLDER_PATH: string;

  DATABASE: {
    HOST: string;
    NAME: string;
    PASSWORD: string;
    PORT: number;
    USER: string;
    DIALECT: any;
    MIGRATIONS_TABLE_NAME: string;
    SSL: boolean;
  };

  RMQ_CONNECTION_CONFIG: {
    PROTOCOL: string;
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
  };

  RMQ_PUB_AUDIT_LOG: IRMQPublisherSettings;

  RMQ_LEADS_CUSTOMER: IRMQConsumerSettings;

  RMQ_LEADS_LEGAL_ENTITY: IRMQConsumerSettings;

  APP_UPLOAD_CONCURRENCY: number;
}
