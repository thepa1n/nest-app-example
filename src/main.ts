import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import Express from 'express';

import { ApplicationConfigInterface, ApplicationSecurityName } from '@config';
import { ApplicationRuntimeProcedures } from './runtime-procedures';
import { UnauthorizedExceptionFilter } from '@common/filters';
import { AppModule } from './app.module';
import { ValidationPipeFactory } from '@common/pipes';
import { SystemLoggerService } from '@cross-cutting-concerns/system-logger';
import { setupCompanyLoggerMiddleware } from '@cross-cutting-concerns/company-logger';
import { ApplicationLoggerSymbol } from '@common/ddd/domain/ports';
import { CoreHeadersNamesEnum } from '@cross-cutting-concerns/application-core-headers';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: new SystemLoggerService(),
  });

  const configService: ConfigService<ApplicationConfigInterface> =
    app.get(ConfigService);

  const logger = await app.resolve(ApplicationLoggerSymbol);
  const SERVER_PORT = configService.get('SERVER_PORT');
  const IS_LOCAL = configService.get('IS_LOCAL');
  const IS_DEVELOPMENT = configService.get('IS_DEVELOPMENT');
  const APP_ENVIRONMENT = configService.get('NODE_ENV');

  app.use(Express.json({ limit: '50mb' }));
  app.use(Express.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();

  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useLogger(logger);

  await setupCompanyLoggerMiddleware(app, configService);

  app.useGlobalPipes(
    ValidationPipeFactory.create(logger, IS_DEVELOPMENT || IS_LOCAL),
  );

  if (!IS_LOCAL) {
    await ApplicationRuntimeProcedures.startDatabaseMigrationsAndSeeds();
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME'))
    .setVersion(configService.get('APP_VERSION'))
    .addServer('{BASE_URL}', 'Application base url', {
      BASE_URL: {
        description: 'Base url',
        default: 'http://localhost:3020',
      },
    })
    .addSecurity(ApplicationSecurityName.USER_HEADER, {
      type: 'apiKey',
      description: 'User Id who initiate requests',
      bearerFormat: 'UUID',
      in: 'header',
      name: CoreHeadersNamesEnum.USER_ID,
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/swagger', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
    customSiteTitle:
      `[${configService.get('APP_VERSION')}]` +
      ` ${configService.get('APP_NAME')}`,
  });

  await app.listen(SERVER_PORT, () => {
    logger.info(
      `Server started at port ${SERVER_PORT} in ${APP_ENVIRONMENT} environment`,
    );
  });
}

bootstrap();
