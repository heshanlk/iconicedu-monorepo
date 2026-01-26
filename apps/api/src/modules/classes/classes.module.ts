import { Module } from '@nestjs/common';
import { ClassesService } from '@iconicedu/api/modules/classes/classes.service';
import { ClassesController } from '@iconicedu/api/modules/classes/classes.controller';

@Module({
  providers: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
