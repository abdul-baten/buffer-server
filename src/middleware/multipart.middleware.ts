/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

const multipart_middleware = (app: NestFastifyApplication): void => {
  app.register(require('fastify-multipart'));
};

export default multipart_middleware;
