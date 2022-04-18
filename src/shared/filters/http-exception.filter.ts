import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: T, host: ArgumentsHost): void {
    const TAG = 'HttpExceptionFilter';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as Record<string, unknown>);

    this.logger.error(`${request.url} ${request.method}`, {
      context: TAG,
      error: exception.stack,
    });

    response.status(status).json({
      ...this.formatError(error),
      timestamp: new Date().toISOString(),
    });
  }

  formatError(error: string | Record<string, unknown> | any): any {
    if (error.message && !Array.isArray(error.message)) {
      error.message = [error.message];
    }
    return error;
  }
}
