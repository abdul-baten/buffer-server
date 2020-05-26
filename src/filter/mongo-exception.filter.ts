import * as httpContext from 'express-http-context';
import { CONTEXT } from '@enum';
import { IError } from '@interface';
import { MongoError } from 'mongodb';
import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const context = httpContext.get(CONTEXT.REQUEST_LOGGING);
    httpContext.set(CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception,
    });

    const name = MongoExceptionFilter.name;
    console.warn(name);

    response.status(statusCode).json({
      statusCode,
      errorMessage: exception.errmsg,
    } as IError);
  }
}
