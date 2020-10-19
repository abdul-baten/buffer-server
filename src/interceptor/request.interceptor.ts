import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { EContext } from '@enums';
import { get, set } from 'express-http-context';
import { Request } from 'express';
import type { Observable } from 'rxjs';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  intercept (execution_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const context = get(EContext.REQUEST_LOGGING);
    const request = execution_context.switchToHttp().getRequest() as Request;
    const request_body = { ...request.body };

    Reflect.deleteProperty(request_body, 'user_password');

    set(EContext.REQUEST_LOGGING, {
      ...context,
      controller_method: execution_context.getHandler().name,
      controller_name: execution_context.getClass().name,
      remote_host: request.headers.forwarded,
      request_aborted: request.aborted,
      request_accepted: request.accepted,
      request_body,
      request_complete: request.complete,
      request_cookies: request.cookies,
      request_date: new Date().toUTCString(),
      request_host: request.hostname,
      request_http_version: request.httpVersion,
      request_ip: request.ip,
      request_ips: request.ips,
      request_method: request.method,
      request_original_url: request.originalUrl,
      request_params: request.params,
      request_protocol: request.protocol,
      request_query: request.query,
      request_route: request.route,
      request_secure: request.secure,
      request_subdomains: request.subdomains,
      request_url: request.url,
      request_xhr: request.xhr,
      user_agent: request.headers.user_agent
    });

    return next.handle();
  }
}
