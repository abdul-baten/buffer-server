import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException
} from '@nestjs/common';
import { EContext } from '@enums';
import { get, set } from 'express-http-context';
import { parse as parseStack } from 'error-stack-parser';
import type { FastifyReply } from 'fastify';
import type { IError } from '@interfaces';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch (exception: InternalServerErrorException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const { error_details, error_code, http_code, message } = exception.getResponse() as IError;
    const { message: error_message } = error_details;
    const context = get(EContext.REQUEST_LOGGING);
    const response_body = {
      error_code,
      http_code,
      message
    };

    set(EContext.REQUEST_LOGGING, {
      ...context,
      error_message,
      error_stack: parseStack(error_details),
      is_error: true,
      response_body
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      ...response_body
    });
  }
}
