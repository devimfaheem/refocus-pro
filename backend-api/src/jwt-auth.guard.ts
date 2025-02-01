import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized access - Invalid or expired token',
        error: 'Unauthorized',
      });
    }
    return user;
  }
}