import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof EntityNotFoundError) {
          return throwError(() => new NotFoundException());
        } else {
          return throwError(() => err);
        }
      }),
    );
  }
}
