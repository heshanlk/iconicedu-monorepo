import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  @UseGuards(AuthGuard)
  list(@Req() req: any) {
    return this.channelsService.listChannelsForUser(req.user.id);
  }
}
