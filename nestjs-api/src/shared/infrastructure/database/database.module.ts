import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { EnvConfigModule } from '../env-config/env-config.module';

@Module({
  imports: [EnvConfigModule.forRoot()],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
