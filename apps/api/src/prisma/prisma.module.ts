import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@iconicedu/api/prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
