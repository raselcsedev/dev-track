import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UpdateGoalDto } from './dto/update-goal.dto.js';
import { GetGoalsQueryDto } from './dto/get-goals-query.dto.js';
import { GoalsService } from './goals.service.js';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // POST /goals
  @Post()
  create(@Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(createGoalDto);
  }

  // GET /goals
  @Get()
  findAll(@Query() query: GetGoalsQueryDto) {
    return this.goalsService.findAll(
      query.search,
      query.completed,
      query.page,
      query.limit,
    );
  }

  // GET /goals/count
  @Get('count')
  countGoals() {
    return this.goalsService.countGoals();
  }

  // GET /goals/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe, PositiveIntPipe) id: number) {
    return this.goalsService.findOne(id);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(id, updateGoalDto);
  }

  @Patch(':id')
  updatePartial(
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe, PositiveIntPipe) id: number) {
    return this.goalsService.remove(id);
  }
}
