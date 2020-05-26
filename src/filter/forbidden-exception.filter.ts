import * as httpContext from 'express-http-context';
import { CONTEXT, ERROR_MESSAGE_MAP, ERROR_MESSAGE } from '@enum';
import { IError } from '@interface';
import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
} from '@nestjs/common';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const context = httpContext.get(CONTEXT.REQUEST_LOGGING);
    httpContext.set(CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception.getResponse(),
    });

    response.status(statusCode).json({
      errorCode: ERROR_MESSAGE.SESSION_EXPIRED_CODE,
      statusCode,
      errorMessage: ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.SESSION_EXPIRED_CODE),
    } as IError);
  }
}
