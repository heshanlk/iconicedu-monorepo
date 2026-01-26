import { Module } from '@nestjs/common';
import { AuthService } from '@iconicedu/api/modules/auth/auth.service';
import { AuthGuard } from '@iconicedu/api/modules/auth/auth.guard';

@Module({
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
