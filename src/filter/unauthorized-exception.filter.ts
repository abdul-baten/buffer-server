import * as httpContext from 'express-http-context';
import { E_CONTEXT, E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP } from '@enum';
import { I_ERROR } from '@app/interface';
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

    const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);
    httpContext.set(E_CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception.getResponse(),
    });

    response.json({
      errorCode: E_ERROR_MESSAGE.UNAUTHORISED_ERROR,
      statusCode,
      errorMessage: E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.UNAUTHORISED_ERROR),
    } as I_ERROR);
  }
}
