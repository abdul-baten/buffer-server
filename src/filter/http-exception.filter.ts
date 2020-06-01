import * as httpContext from 'express-http-context';
import { E_CONTEXT } from '@enums';
import { I_ERROR } from '@interfaces';
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

    const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);
    httpContext.set(E_CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception.getResponse(),
    });

    const name = HttpExceptionFilter.name;
    console.warn(name);

    response.status(statusCode).json({
      statusCode,
      errorMessage,
    } as I_ERROR);
  }
}
