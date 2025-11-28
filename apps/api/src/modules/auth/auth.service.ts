import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

// In production you should validate JWTs using Supabase JWKS or your own signing key.
@Injectable()
export class AuthService {
  decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
