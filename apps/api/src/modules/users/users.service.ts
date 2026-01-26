import { Injectable } from '@nestjs/common';
import { PrismaService } from '@iconicedu/api/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findCurrentUser(id: string) {
    return this.prisma.profile.findUnique({ where: { id } });
  }
}
