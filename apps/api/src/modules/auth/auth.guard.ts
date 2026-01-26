import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@iconicedu/api/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }
    const token = authHeader.slice('Bearer '.length);
    const decoded = this.authService.decodeToken(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = {
      id: decoded.sub,
      role: decoded.user_metadata?.app_role ?? 'guardian',
    };

    return true;
  }
}
