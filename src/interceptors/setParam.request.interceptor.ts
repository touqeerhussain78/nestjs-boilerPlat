import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

@Injectable()
export class SetParamRequestInterceptor implements NestInterceptor {
  constructor(protected key?: any) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    request.body = {
      ...request.body,
      editId: request.params[`${this.key ?? 'id'}`],
    };

    return next.handle();
  }
}
