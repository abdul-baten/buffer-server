import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { EContext } from '@enums';
import { get, set } from 'express-http-context';
import type { Observable } from 'rxjs';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  intercept (execution_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const context = get(EContext.REQUEST_LOGGING);
    const request = execution_context.switchToHttp().getRequest() as FastifyRequest;

    set(EContext.REQUEST_LOGGING, {
      ...context,
      controller_method: execution_context.getHandler().name,
      controller_name: execution_context.getClass().name,
      remote_host: request.headers.forwarded,
      request_body: request.body,
      request_date: new Date().toUTCString(),
      request_host: request.hostname,
      request_ip: request.ip,
      request_method: request.routerMethod,
      request_params: request.params,
      request_query: request.query,
      request_url: request.routerPath,
      user_agent: request.headers.user_agent
    });

    return next.handle();
  }
}
