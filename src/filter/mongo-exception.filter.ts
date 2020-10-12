import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus
} from '@nestjs/common';
import { EContext } from '@enums';
import { get, set } from 'express-http-context';
import { MongoError } from 'mongodb';
import { parse as parseStack } from 'error-stack-parser';
import type { FastifyReply } from 'fastify';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch (exception: MongoError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const { code, message } = exception;
    const context = get(EContext.REQUEST_LOGGING);

    set(EContext.REQUEST_LOGGING, {
      ...context,
      error_message: message,
      error_stack: parseStack(exception),
      is_error: true
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error_code: code,
      http_code: 500,
      message
    });
  }
}
