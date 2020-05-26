import * as httpContext from 'express-http-context';
import { AuthMapper } from '@app/routes/auth/mapper/auth.mapper';
import { CONTEXT } from '@enum';
import { Error } from 'mongoose';
import { IError } from '@app/interface';
import { Response } from 'express';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch(Error)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = HttpStatus.BAD_REQUEST;

    const context = httpContext.get(CONTEXT.REQUEST_LOGGING);
    httpContext.set(CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception,
    });

    const name = ValidationExceptionFilter.name;
    console.warn(name);

    response.status(statusCode).json({
      statusCode,
      errorMessage: AuthMapper.signupValidationMapper(exception),
    } as IError);
  }
}
