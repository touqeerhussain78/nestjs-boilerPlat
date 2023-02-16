import { JwtAuthGuard } from './jwt-auth.guard';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GuestGuard extends JwtAuthGuard {
  handleRequest(_err, user) {
    if (user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
