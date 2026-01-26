import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '@iconicedu/api/modules/users/users.service';
import { AuthGuard } from '@iconicedu/api/modules/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req: any) {
    return this.usersService.findCurrentUser(req.user.id);
  }
}
