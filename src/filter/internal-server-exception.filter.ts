import * as httpContext from 'express-http-context';
import { E_CONTEXT } from '@enum';
import { I_ERROR } from '@interface';
import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const {
      error: errorCode,
      message: errorMessage,
    } = exception.getResponse() as any;

    const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);
    httpContext.set(E_CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception.getResponse(),
    });

    response.status(statusCode).json({
      errorCode,
      statusCode,
      errorMessage,
    } as I_ERROR);
  }
}
