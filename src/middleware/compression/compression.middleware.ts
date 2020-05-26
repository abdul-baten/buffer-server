import * as compression from 'compression';
import * as zlib from 'zlib';
import { INestApplication } from '@nestjs/common';

const compressionMiddleware = (app: INestApplication) => {
  app.use(
    compression({
      chunkSize: 16 * 1024,
      level: 9,
      memLevel: 9,
      strategy: zlib.Z_HUFFMAN_ONLY,
    }),
  );
};

export default compressionMiddleware;
