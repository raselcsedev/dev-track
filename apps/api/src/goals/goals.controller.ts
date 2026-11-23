
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

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../common/decorators/current-user.decorator.js';

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
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalsService.create(user.userId, createGoalDto);
  }

  // GET /goals
  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetGoalsQueryDto,
  ) {
    return this.goalsService.findAll(
      user.userId,
      query.search,
      query.completed,
      query.page,
      query.limit,
    );
  }

  // GET /goals/count
  @Get('count')
  countGoals(@CurrentUser() user: AuthenticatedUser) {
    return this.goalsService.countGoals(user.userId);
  }

  // GET /goals/:id
  @Get(':id')
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
  ) {
    return this.goalsService.findOne(user.userId, id);
  }

  // PUT /goals/:id
  @Put(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(user.userId, id, updateGoalDto);
  }

  // PATCH /goals/:id
  @Patch(':id')
  updatePartial(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(user.userId, id, updateGoalDto);
  }

  // DELETE /goals/:id
  @Delete(':id')
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
  ) {
    return this.goalsService.remove(user.userId, id);
  }
}
