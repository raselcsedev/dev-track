import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';

import { UpdateGoalDto } from './dto/update-goal.dto.js';

import { GoalsService } from './goals.service.js';
import { CreateGoalDto } from './dto/create-goal.dto.js';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // POST /goals
  @Post()
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(createGoalDto);
  }

  // GET /goals
  @Get()
  findAll() {
    return this.goalsService.findAll();
  }

  // GET /goals/count
  @Get('count')
  countGoals() {
    return this.goalsService.countGoals();
  }

  // GET /goals/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(Number(id));
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(Number(id), updateGoalDto);
  }

  @Patch(':id')
  updatePartial(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(Number(id), updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalsService.remove(Number(id));
  }
}
