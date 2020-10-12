import compressionMiddleware from './compression.middleware';
import cookieParserMiddleware from './cookie-parser.middleware';
import helmetMiddleware from './helmet.middleware';
import morganMiddleware from './morgan.middleware';
import multipartMiddleware from './multipart.middleware';
import rateLimitMiddleware from './rate-limit.middleware';

export default [
  compressionMiddleware,
  cookieParserMiddleware,
  helmetMiddleware,
  morganMiddleware,
  multipartMiddleware,
  rateLimitMiddleware
];
