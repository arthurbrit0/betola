import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class DebugInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const origin = headers.origin || 'sem origin';

    this.logger.debug(`📥 ${method} ${url}`);
    this.logger.debug(`🌐 Origin: ${origin}`);
    this.logger.debug(`🔧 User-Agent: ${userAgent}`);

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response;
        const delay = Date.now() - now;
        this.logger.debug(`📤 ${method} ${url} ${statusCode} - ${delay}ms`);
      }),
    );
  }
}
