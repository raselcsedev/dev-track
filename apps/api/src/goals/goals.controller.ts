import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
  findAll(
    @Query('search') search?: string,
    @Query('completed') completed?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.goalsService.findAll(
      search,
      completed,
      Number(page) || 1,
      Number(limit) || 10,
    );
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
  @Get('search')
  searchGoals(@Query('search') search: string) {
    return this.goalsService.search(search);
  }
}
