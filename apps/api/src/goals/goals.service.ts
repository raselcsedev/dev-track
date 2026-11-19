import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { UpdateGoalDto } from './dto/update-goal.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class GoalsService {
  private nextId = 3;
  private goals = [
    {
      id: 1,
      title: 'Learn NestJS',
      completed: false,
    },
    {
      id: 2,
      title: 'Build DevTrack API',
      completed: false,
    },
  ];
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, completed?: string, page = 1, limit = 10) {
    const where = {
      ...(search ? { title: { contains: search } } : {}),
      ...(completed !== undefined ? { completed: completed === 'true' } : {}),
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

  async findOne(id: number) {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return goal;
  }
  async countGoals() {
    return this.prisma.goal.count();
  }
  async create(createGoalDto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        title: createGoalDto.title,
        description: createGoalDto.description,
        completed: createGoalDto.completed ?? false,
      },
    });
  }

  async update(id: number, updateGoalDto: UpdateGoalDto) {
    try {
      return await this.prisma.goal.update({
        where: { id },
        data: updateGoalDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Goal with ID ${id} not found`);
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deletedGoal = await this.prisma.goal.delete({
        where: { id },
      });

      return {
        message: 'Goal deleted successfully',
        data: deletedGoal,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Goal with ID ${id} not found`);
      }

      throw error;
    }
  }

  search(search: string) {
    if (!search) {
      return this.goals;
    }

    return this.goals.filter((goal) =>
      goal.title.toLowerCase().includes(search.toLowerCase()),
    );
  }
}
