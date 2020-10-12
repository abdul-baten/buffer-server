/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { EContext } from '@enums';
import {
  get,
  middleware,
  ns,
  set
} from 'express-http-context';
import { LoggerUtilService } from '@utils';
import { v4 as uuidv4 } from 'uuid';

import type { NextFunction, Request, Response } from 'express';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
const morgan_middleware = (app: NestFastifyApplication): void => {
  const logger_service = app.get(LoggerUtilService);

  app.register(require('fastify-express'));

  app.use(middleware);

  app.use((request: Request, response: Response, next: NextFunction): void => {
    ns.bindEmitter(request);
    ns.bindEmitter(response);

    next();
  });

  app.use((request: Request, response: Response, next: NextFunction): void => {
    const correlation_id = request.headers['x-correlation-id'] ?? uuidv4();

    // eslint-disable-next-line no-param-reassign
    request.headers['x-correlation-id'] = correlation_id;
    response.header('x-correlation-id', correlation_id);

    const context = get(EContext.REQUEST_LOGGING);

    set(EContext.REQUEST_LOGGING, {
      ...context,
      correlation_id
    });

    next();
  });

  // eslint-disable-next-line @typescript-eslint/naming-convention
  app.use((_request: Request, response: Response, next: NextFunction): void => {
    response.on('finish', (): void => {
      const context = get(EContext.REQUEST_LOGGING);
      const log_details = {
        ...context,
        response_headers_sent: response.headersSent,
        response_status: response.statusCode,
        response_status_message: response.statusMessage
      };

      if (context && !context.is_error) {
        logger_service.logWarning(JSON.stringify(log_details, null, parseInt('2', 10)));
      } else {
        logger_service.logError(new Error(JSON.stringify(log_details, null, parseInt('2', 10))));
      }
    });

    next();
  });
};

export default morgan_middleware;
