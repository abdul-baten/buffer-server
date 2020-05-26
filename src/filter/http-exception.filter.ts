import * as httpContext from 'express-http-context';
import { CONTEXT } from '@enum';
import { IError } from '@interface';
import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const errorMessage = '';

    const context = httpContext.get(CONTEXT.REQUEST_LOGGING);
    httpContext.set(CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception.getResponse(),
    });

    const name = HttpExceptionFilter.name;
    console.warn(name);

    response.status(statusCode).json({
      statusCode,
      errorMessage,
    } as IError);
  }
}
