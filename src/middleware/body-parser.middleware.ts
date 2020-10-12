/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

const body_parse_middleware = (app: NestFastifyApplication): void => {
  app.register(require('fastify-formbody'));
};

export default body_parse_middleware;
