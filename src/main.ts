import middlewares from '@middlewares';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import {
  ForbiddenExceptionFilter,
  InternalServerErrorExceptionFilter,
  MongoExceptionFilter,
  NotFoundExceptionFilter,
  UnauthorizedExceptionFilter,
  UnprocessableEntityExceptionFilter,
  ValidationExceptionFilter
} from '@filters';

const HandleGlobalProcess = () => {
  process.on('uncaughtException', (error_details) => {
    Logger.error({ error_details,
      error_type: 'uncaughtException' });
  });

  process.on('unhandledRejection', (error_details) => {
    Logger.error({ error_details,
      error_type: 'unhandledRejection' });
  });

  process.on('SIGINT', (error_details) => {
    Logger.error({ error_details,
      error_type: 'SIGINT' });
  });
};

const HandleAppSettings = async (app: NestFastifyApplication): Promise<void> => {
  const config_service = app.get(ConfigService);
  const port: number = config_service.get('APP.PORT') as number;
  const prefix: string = config_service.get('APP.API_PREFIX') as string;

  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new InternalServerErrorExceptionFilter(),
    new ForbiddenExceptionFilter(),
    new UnauthorizedExceptionFilter(),
    new UnprocessableEntityExceptionFilter(),
    new ValidationExceptionFilter(),
    new NotFoundExceptionFilter(),
    new MongoExceptionFilter()
  );

  app.enableShutdownHooks();
  app.enableCors({
    credentials: true,
    origin: true
  });

  await app.listen(port);
};

const bootstrap = async (): Promise<void> => {
  const cert = readFileSync(join(process.cwd(), 'src/cert', 'cert.crt'));
  const key = readFileSync(join(process.cwd(), 'src/cert', 'cert.key'));
  const fastify_adaptar = new FastifyAdapter({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    caseSensitive: true,
    http2: true,
    https: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      allowHTTP1: true,
      cert,
      key
    },
    logger: true
  });
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(AppModule, fastify_adaptar, {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    httpsOptions: {
      cert,
      key
    }
  });

  try {
    for await (const middleware of middlewares) {
      middleware(app);
    }
  } catch (err) {
    Logger.error(err);
  }

  HandleGlobalProcess();
  HandleAppSettings(app);
};

bootstrap();
