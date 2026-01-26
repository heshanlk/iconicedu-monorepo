import { Controller, Get } from '@nestjs/common';
import { ClassesService } from '@iconicedu/api/modules/classes/classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  list() {
    return this.classesService.listClasses();
  }
}
