import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Global() //kalau pakai global cukup import ke app module (parent aja)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
