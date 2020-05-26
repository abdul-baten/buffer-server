import * as httpContext from 'express-http-context';
import { CONTEXT, ERROR_MESSAGE, ERROR_MESSAGE_MAP } from '@enum';
import { IError } from '@app/interface';
import { Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = response.statusCode;

    const context = httpContext.get(CONTEXT.REQUEST_LOGGING);
    httpContext.set(CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception.getResponse(),
    });

    response.json({
      errorCode: ERROR_MESSAGE.UNAUTHORISED_ERROR,
      statusCode,
      errorMessage: ERROR_MESSAGE_MAP.get(ERROR_MESSAGE.UNAUTHORISED_ERROR),
    } as IError);
  }
}
