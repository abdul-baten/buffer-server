/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

const helmet_middleware = (app: NestFastifyApplication): void => {
  app.register(require('fastify-helmet'));
};

export default helmet_middleware;
