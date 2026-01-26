import { Module } from '@nestjs/common';
import { UsersService } from '@iconicedu/api/modules/users/users.service';
import { UsersController } from '@iconicedu/api/modules/users/users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
