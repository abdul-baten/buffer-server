import * as httpContext from 'express-http-context';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { E_CONTEXT } from '@enums';
import { Response } from 'express';
import { I_ERR } from '@interfaces';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { errorDetails, errorCode, httpCode, message } = exception.getResponse() as I_ERR;

    const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);
    httpContext.set(E_CONTEXT.REQUEST_LOGGING, {
      ...context,
      errorDetails,
      isError: true,
    });

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      errorCode,
      httpCode,
      message,
    });
  }
}
