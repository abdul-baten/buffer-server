import * as httpContext from 'express-http-context';
import { AuthMapper } from 'src/mapper';
import { E_CONTEXT } from '@enums';
import { Error } from 'mongoose';
import { I_ERROR } from '@interfaces';
import { Response } from 'express';
import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';

@Catch(Error)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = HttpStatus.BAD_REQUEST;

    const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);
    httpContext.set(E_CONTEXT.REQUEST_LOGGING, {
      ...context,
      isError: true,
      errorDetails: exception,
    });

    const name = ValidationExceptionFilter.name;
    console.warn(name);

    response.status(statusCode).json({
      statusCode,
      errorMessage: AuthMapper.signupValidationMapper(exception),
    } as I_ERROR);
  }
}
