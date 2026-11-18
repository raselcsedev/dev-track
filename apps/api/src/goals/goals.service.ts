import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { UpdateGoalDto } from './dto/update-goal.dto.js';

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

  findAll(search?: string, completed?: string, page = 1, limit = 10) {
    let filteredGoals = this.goals;

    // Search
    if (search) {
      filteredGoals = filteredGoals.filter((goal) =>
        goal.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filtering
    if (completed !== undefined) {
      const isCompleted = completed === 'true';

      filteredGoals = filteredGoals.filter(
        (goal) => goal.completed === isCompleted,
      );
    }

    // Pagination
    const total = filteredGoals.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const data = filteredGoals.slice(skip, skip + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  findOne(id: number) {
    return this.goals.find((goal) => goal.id === id);
  }
  countGoals() {
    return this.goals.length;
  }
  create(createGoalDto: CreateGoalDto) {
    const newGoal = {
      id: this.nextId++,
      ...createGoalDto,
      completed: createGoalDto.completed ?? false,
    };

    this.goals.push(newGoal);

    return newGoal;
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    const goal = this.findOne(id);

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    Object.assign(goal, updateGoalDto);

    return goal;
  }

  remove(id: number) {
    const index = this.goals.findIndex((goal) => goal.id === id);

    if (index === -1) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    const deletedGoal = this.goals.splice(index, 1);

    return {
      message: 'Goal deleted successfully',
      data: deletedGoal[0],
    };
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
