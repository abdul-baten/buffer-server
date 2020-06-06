import * as httpContext from 'express-http-context';
import { ArgumentsHost, Catch, ExceptionFilter, UnprocessableEntityException } from '@nestjs/common';
import { E_CONTEXT } from '@enums';
import { I_ERROR } from '@interfaces';
import { Response } from 'express';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const { error: errorCode, message: errorMessage } = exception.getResponse() as any;

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
