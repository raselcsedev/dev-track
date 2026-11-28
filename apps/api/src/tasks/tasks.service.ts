import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createTaskDto: CreateTaskDto) {
    const { title, description, dueDate } = createTaskDto;

    return this.prisma.task.create({
      data: {
        title,
        description: description ?? null,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });
  }

  async findAll(userId: number, query: GetTasksQueryDto) {
    const { search, completed, page, limit } = query;

    const where = {
      userId,
      ...(completed !== undefined && { completed }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto) {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        ...updateTaskDto,
        dueDate:
          updateTaskDto.dueDate !== undefined
            ? updateTaskDto.dueDate
              ? new Date(updateTaskDto.dueDate)
              : null
            : undefined,
      },
    });
  }

  async remove(id: number, userId: number) {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
