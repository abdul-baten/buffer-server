import middlewares from '@middleware';
import { AppModule } from '@app/app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { UnauthorizedExceptionFilter } from './filter/unauthorized-exception.filter';
import {
  // HttpExceptionFilter,
  ForbiddenExceptionFilter,
  InternalServerErrorExceptionFilter,
  MongoExceptionFilter,
  ValidationExceptionFilter,
} from '@filter';

async function bootstrap() {
  const cert = readFileSync(join(process.cwd(), 'src/cert', 'cert.crt'));
  const key = readFileSync(join(process.cwd(), 'src/cert', 'cert.key'));
  const app: INestApplication = await NestFactory.create(AppModule, {
    httpsOptions: {
      key,
      cert,
    },
  });
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('APP.PORT') as number;
  const prefix: string = configService.get<string>('APP.API_PREFIX') as string;

  process.on('uncaughtException', (error: Error) => {
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (error: Error) => {
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  });

  try {
    for await (const middleware of middlewares) {
      middleware(app);
    }
  } catch (err) {
    console.error(err);
  }

  app.enableCors({
    origin: [
      'https://localhost:3000',
      'https://localhost:5000',
      'http://localhost:5000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  app.setGlobalPrefix(prefix);
  app.useGlobalFilters(
    new InternalServerErrorExceptionFilter(),
    // new HttpExceptionFilter(),
    new ForbiddenExceptionFilter(),
    new UnauthorizedExceptionFilter(),
    new ValidationExceptionFilter(),
    new MongoExceptionFilter(),
  );

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
