import * as httpContext from 'express-http-context';
import * as morgan from 'morgan';
import { CommonUtil, LoggerUtil, NetworkUtil } from '@util';
import { ConfigService } from '@nestjs/config';
import { E_CONTEXT } from '@enum';
import { INestApplication } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const morganMiddleware = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const morganFormat = configService.get<string>(
    'LOGGING.MORGAN_FORMAT',
    'combined',
  );

  app.use(httpContext.middleware);

  app.use(
    morgan(morganFormat, {
      skip: (_req: Request, response: Response) => response.statusCode >= 400,
      stream: process.stderr,
    }),
  );

  app.use(
    morgan(morganFormat, {
      skip: (_req: Request, response: Response) => response.statusCode < 400,
      stream: process.stdout,
    }),
  );

  app.use((request: Request, response: Response, next: NextFunction): void => {
    httpContext.ns.bindEmitter(request);
    httpContext.ns.bindEmitter(response);

    const { url, method, params, query } = request;

    httpContext.set(E_CONTEXT.REQUEST_LOGGING, {
      requestMethod: method,
      requestParams: params,
      requestQuery: query,
      requestURL: url,
    });

    next();
  });

  app.use((request: Request, response: Response, next: NextFunction): void => {
    const correlationID = request.headers['Buffer-Correlation-ID'] || uuidv4();
    const requestID = uuidv4();

    request.headers['Buffer-Correlation-ID'] = correlationID;
    response.setHeader('Buffer-Correlation-ID', correlationID);

    const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);
    httpContext.set(E_CONTEXT.REQUEST_LOGGING, {
      ...context,
      correlationID,
      requestID,
    });

    next();
  });

  app.use((request: Request, _response: Response, next: NextFunction): void => {
    const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);

    request.on('end', (): void => {
      httpContext.set(E_CONTEXT.REQUEST_LOGGING, {
        ...context,
      });
    });

    // request.on('data', (_: any): void => {});

    request.on('error', (_: Error): void => {
      httpContext.set(E_CONTEXT.REQUEST_LOGGING, { ...context, isError: true });
    });

    next();
  });

  app.use((request: Request, response: Response, next: NextFunction): void => {
    const { headers } = request;

    response.on('close', (): void => {
      const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);
      const {
        action,
        correlationID,
        location,
        requestID,
        requestURL,
      } = context;
      const logMeta = {
        ...context,
        action,
        correlationID,
        location,
        remoteHost: headers['x-forwarded-for'] ?? 'no-host-found',
        requestDate: new Date().toISOString(),
        requestID,
        requestURL: requestURL,
        responseTime: response.getHeader('x-response-time'),
        sourceCPUInfo: NetworkUtil.getCPUInfo(),
        sourceIPAddress: NetworkUtil.getIPAddress(),
        sourceOSType: NetworkUtil.getOSType(),
        statusCode: response.statusCode,
        statusMessage: response.statusCode,
        userAgent: request.header('user-agent'),
      };

      const contextObj = Object.assign(context, logMeta);

      if (context && !context.isError) {
        LoggerUtil.logInfo(CommonUtil.getSerializedJSON(contextObj));
      } else {
        delete context.isError;
        LoggerUtil.logError(
          new Error(CommonUtil.getSerializedJSON(contextObj)),
        );
      }
    });

    next();
  });
};

export default morganMiddleware;
