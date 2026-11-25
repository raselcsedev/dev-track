
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TasksController } from './tasks.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}

