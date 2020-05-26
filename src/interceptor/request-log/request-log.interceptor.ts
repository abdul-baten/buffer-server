import * as httpContext from 'express-http-context';
import { CONTEXT } from '@enum';
import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const context = httpContext.get(CONTEXT.REQUEST_LOGGING);

    httpContext.set(CONTEXT.REQUEST_LOGGING, {
      ...context,
      controllerMethod: executionContext.getHandler().name,
      controllerName: executionContext.getClass().name,
    });

    return next.handle();
  }
}
