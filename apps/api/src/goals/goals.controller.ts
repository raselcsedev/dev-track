
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
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { UpdateGoalDto } from './dto/update-goal.dto.js';
import { GetGoalsQueryDto } from './dto/get-goals-query.dto.js';
import { GoalsService } from './goals.service.js';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // POST /goals
  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalsService.create(req.user.userId, createGoalDto);
  }

  // GET /goals
  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetGoalsQueryDto,
  ) {
    return this.goalsService.findAll(
      req.user.userId,
      query.search,
      query.completed,
      query.page,
      query.limit,
    );
  }

  // GET /goals/count
  @Get('count')
  countGoals(@Req() req: AuthenticatedRequest) {
    return this.goalsService.countGoals(req.user.userId);
  }

  // GET /goals/:id
  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
  ) {
    return this.goalsService.findOne(req.user.userId, id);
  }

  // PUT /goals/:id
  @Put(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(
      req.user.userId,
      id,
      updateGoalDto,
    );
  }

  // PATCH /goals/:id
  @Patch(':id')
  updatePartial(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(
      req.user.userId,
      id,
      updateGoalDto,
    );
  }

  // DELETE /goals/:id
  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe, PositiveIntPipe) id: number,
  ) {
    return this.goalsService.remove(req.user.userId, id);
  }
}
