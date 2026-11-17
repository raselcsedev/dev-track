import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto.js';

@Injectable()
export class GoalsService {
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

  findAll() {
    return this.goals;
  }

  findOne(id: number) {
    return this.goals.find((goal) => goal.id === id);
  }
  countGoals() {
    return this.goals.length;
  }
  create(createGoalDto: CreateGoalDto) {
    const newGoal = {
      id: this.goals.length + 1,
      ...createGoalDto,
      completed: createGoalDto.completed ?? false,
    };

    this.goals.push(newGoal);

    return newGoal;
  }
}
