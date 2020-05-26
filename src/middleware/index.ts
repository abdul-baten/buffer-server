import appStatusMonitorMiddleware from './status-monitor/status-monitor.middleware';
import bodyParserMiddleware from './body-parser/body-parser.middleware';
import compressionMiddleware from './compression/compression.middleware';
import cookieParserMiddleware from './cookie-parser/cookie-parser.middleware';
import errorHandlerMiddleWare from './error-handler/error-handler.middleware';
import helmetMiddleware from './helmet/helmet.middleware';
import methodOverrideMiddleware from './method-override/method-override.middleware';
import morganMiddleware from './morgan/morgan.middleware';
import rateLimitMiddleware from './rate-limit/rate-limit.middleware';
import responseTimeMiddleware from './response-time/response-time.middleware';

export default [
  appStatusMonitorMiddleware,
  helmetMiddleware,
  morganMiddleware,
  rateLimitMiddleware,
  cookieParserMiddleware,
  bodyParserMiddleware,
  methodOverrideMiddleware,
  compressionMiddleware,
  responseTimeMiddleware,
  errorHandlerMiddleWare,
];
