/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

const cookie_parser_middleware = (app: NestFastifyApplication): void => {
  app.register(require('fastify-cookie'));
};

export default cookie_parser_middleware;
