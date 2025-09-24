import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): any {
    //   Observable<any> | Promise<Observable<any>>
    const now = Date.now();
    //? Response interceptor
    //! Tab makes side effect without changing response (caching, adding something to db)
    //! Map changing response
    next.handle().pipe(
      tap(() => {
        console.log('After: ' + Date.now());
        console.log('Time process: ' + `${Date.now() - now}ms`);
      }),
    );
  }
}
