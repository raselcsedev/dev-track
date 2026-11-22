
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { UpdateGoalDto } from './dto/update-goal.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: number,
    search?: string,
    completed?: boolean,
    page = 1,
    limit = 10,
  ) {
    const where: Prisma.GoalWhereInput = {
      userId,
      ...(search ? { title: { contains: search } } : {}),
      ...(completed !== undefined ? { completed } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.goal.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.goal.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: number, id: number) {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return goal;
  }

  async countGoals(userId: number) {
    return this.prisma.goal.count({
      where: { userId },
    });
  }

  async create(userId: number, createGoalDto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        title: createGoalDto.title,
        description: createGoalDto.description,
        completed: createGoalDto.completed ?? false,
        userId,
      },
    });
  }

  async update(
    userId: number,
    id: number,
    updateGoalDto: UpdateGoalDto,
  ) {
    const result = await this.prisma.goal.updateMany({
      where: {
        id,
        userId,
      },
      data: updateGoalDto,
    });

    if (result.count === 0) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return this.findOne(userId, id);
  }

  async remove(userId: number, id: number) {
    const goal = await this.findOne(userId, id);

    await this.prisma.goal.deleteMany({
      where: {
        id,
        userId,
      },
    });

    return {
      message: 'Goal deleted successfully',
      data: goal,
    };
  }
}
