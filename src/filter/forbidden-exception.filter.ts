import * as httpContext from 'express-http-context';
import { E_CONTEXT, E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP } from '@enums';
import { I_ERROR } from '@interfaces';
import { Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from '@nestjs/common';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);
    httpContext.set(E_CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception.getResponse(),
    });

    response.status(statusCode).json({
      errorCode: E_ERROR_MESSAGE.SESSION_EXPIRED_CODE,
      statusCode,
      errorMessage: E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.SESSION_EXPIRED_CODE),
    } as I_ERROR);
  }
}
