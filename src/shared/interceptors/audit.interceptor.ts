import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Class representing a Request interceptor
 * for API requests to provide logging of users access types
 * a payload object
 * @author Sam Rutakayile
 * @version 1.0
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();
    this.logger.info(
      `User is attempting to make a request to: ${url} ${method}`,
      { context: context.getClass().name },
    );
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.info(
          `User successfully made a request to:${url} ${method} ${duration}ms`,
          { context: context.getClass().name },
        );
      }),
    );
  }
}
