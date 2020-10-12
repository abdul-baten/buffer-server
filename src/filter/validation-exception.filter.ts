import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common';
import { AuthMapper } from 'src/mapper';
import { EContext } from '@enums';
import { Error } from 'mongoose';
import { get, set } from 'express-http-context';
import { parse as parseStack } from 'error-stack-parser';
import type { FastifyReply } from 'fastify';

@Catch(Error)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch (exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const context = get(EContext.REQUEST_LOGGING);

    set(EContext.REQUEST_LOGGING, {
      ...context,
      error_message: exception.message,
      error_stack: parseStack(exception),
      is_error: true
    });

    response.status(HttpStatus.BAD_REQUEST).send({
      error_code: 404,
      http_code: 404,
      message: AuthMapper.signupValidationMapper(exception)
    });
  }
}
