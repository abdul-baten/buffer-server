/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

const rate_limit_middleware = (app: NestFastifyApplication): void => {
  app.register(require('fastify-rate-limit'), {
    addHeaders: {
      'retry-after': true,
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true
    },
    max: 1000,
    // eslint-disable-next-line no-magic-numbers
    timeWindow: 15 * 60 * 1000
  });
};

export default rate_limit_middleware;
