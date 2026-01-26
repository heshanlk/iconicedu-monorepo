import { Injectable } from '@nestjs/common';
import { PrismaService } from '@iconicedu/api/prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  listClasses() {
    return this.prisma.class.findMany();
  }
}
