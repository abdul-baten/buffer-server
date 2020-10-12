/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as zlib from 'zlib';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

const compression_middleware = (app: NestFastifyApplication): void => {
  app.register(require('fastify-compress'), {
    brotliOptions: { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } },
    encodings: ['br', 'deflate', 'gzip'],
    global: true,
    requestEncodings: ['gzip'],
    threshold: 0,
    zlibOptions: { level: 9 }
  });
};

export default compression_middleware;
