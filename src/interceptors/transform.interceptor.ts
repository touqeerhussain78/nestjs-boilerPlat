import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  message?: string;
  statusCode?: number;
  token?: string;
  total?: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: Response<T> = {
          data,
          message: 'OK',
          statusCode: context.switchToHttp().getResponse().statusCode,
        };
        if (data) {
          if (data.code) {
            response.statusCode = data.coe;
          }
          if (data.msg) {
            response.message = data.msg;
          }
          if (data.data) {
            response.data = data.data;
          }
          if (data.token) {
            response.token = data.token;
          }
          if (data.total) {
            response.total = data.total;
          }
        }
        return response;
      }),
    );
  }
}
