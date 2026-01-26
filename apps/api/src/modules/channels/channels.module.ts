import { Module } from '@nestjs/common';
import { ChannelsService } from '@iconicedu/api/modules/channels/channels.service';
import { ChannelsController } from '@iconicedu/api/modules/channels/channels.controller';

@Module({
  providers: [ChannelsService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
