import path from 'path';
import packageJson from '../../package.json';

import {
  TypeormDatabaseConfigInterface,
  ApplicationConfigInterface,
  RmqConnectionConfigInterface,
  RmqPublisherEnvironment,
} from './types';

const ENV = process.env;

export enum AppEnvironment {
  Development = 'development',
  Production = 'production',
  Local = 'local',
}

export function InitApplicationConfig(): ApplicationConfigInterface {
  const dbConfig: TypeormDatabaseConfigInterface = JSON.parse(ENV.DB_CONFIG);
  const rmqConfig: RmqConnectionConfigInterface = JSON.parse(ENV.RMQ_CONFIG);
  const auditLog: RmqPublisherEnvironment = JSON.parse(ENV.AUDIT_LOG_MODULE);
  return {
    SERVER_PORT: parseInt(ENV.PORT),
    NODE_ENV: ENV.NODE_ENV,
    APP_VERSION: packageJson.version,
    APP_NAME: ENV.APPLICATION_NAME,
    // Uniq Microservice Identifier for trace audit logs
    APP_IDENTIFIER: '720614ea-4026-41f6-84ab-aed9d2a5c73a',

    IS_PRODUCTION: ENV.NODE_ENV === AppEnvironment.Production,
    IS_DEVELOPMENT: ENV.NODE_ENV !== AppEnvironment.Production,
    IS_LOCAL: ENV.NODE_ENV === AppEnvironment.Local,

    ROOT_FOLDER_PATH: path.join(__dirname, '..'),

    DATABASE: {
      HOST: dbConfig.dbHost,
      NAME: dbConfig.dbName,
      PASSWORD: dbConfig.dbPassword,
      PORT: parseInt(dbConfig.dbPort, 10),
      USER: dbConfig.dbUser,
      DIALECT: dbConfig.dbDialect,
      SSL: dbConfig.ssl || false,
      MIGRATIONS_TABLE_NAME:
        ENV.TYPEORM_MIGRATIONS_TABLE_NAME || 'local_migrations',
    },

    APP_TIME_ZONE: ENV.TIME_ZONE || 'UTC',

    APP_UPLOAD_CONCURRENCY: parseInt(ENV.UPLOAD_CONCURRENCY, 10) || 100,

    SENSITIVE_DATA_LIST: [
      'access_token',
      'api_key',
      'pageSubscriptionToken',
      'password',
      'publicApiKey',
      'salt',
      'scenarioKey',
      'secret',
      'token',
    ],

    RMQ_CONNECTION_CONFIG: {
      PROTOCOL: rmqConfig.PROTOCOL || 'amqp',
      HOST: rmqConfig.HOST,
      PORT: rmqConfig.PORT,
      USERNAME: rmqConfig.USERNAME,
      PASSWORD: rmqConfig.PASSWORD,
    },

    RMQ_PUB_AUDIT_LOG: {
      exchange: {
        name: auditLog.exchange.name,
        type: auditLog?.exchange?.type,
      },
      routingKey: auditLog.routingKey,
    },

    RMQ_LEADS_CUSTOMER: {
      exchange: {
        name: 'import-leads-exchange',
        type: 'direct',
      },
      routingKey: 'customer-leads-routing-key',
      queue: {
        name: 'customer-leads-queue',
      },
      prefetchCount: 1,
    },

    RMQ_LEADS_LEGAL_ENTITY: {
      exchange: {
        name: 'import-leads-exchange',
        type: 'direct',
      },
      routingKey: 'legal-entity-leads-routing-key',
      queue: {
        name: 'legal-entity-leads-queue',
      },
      prefetchCount: 1,
    },
  };
}
