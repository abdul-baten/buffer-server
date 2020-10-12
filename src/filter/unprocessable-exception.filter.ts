import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnprocessableEntityException
} from '@nestjs/common';
import { EContext } from '@enums';
import { get, set } from 'express-http-context';
import { parse as parseStack } from 'error-stack-parser';
import type { FastifyReply } from 'fastify';
import type { IError } from '@interfaces';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch (exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const { error_details, error_code, http_code, message } = exception.getResponse() as IError;
    const { message: error_message } = error_details;
    const context = get(EContext.REQUEST_LOGGING);

    set(EContext.REQUEST_LOGGING, {
      ...context,
      error_message,
      error_stack: parseStack(error_details),
      is_error: true
    });

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
      error_code,
      http_code,
      message
    });
  }
}
