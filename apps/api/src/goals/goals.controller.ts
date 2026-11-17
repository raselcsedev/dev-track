import { Controller, Get, Param } from '@nestjs/common';
import { GoalsService } from './goals.service.js';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findAll() {
    return this.goalsService.findAll();
  }
  @Get('count')
  countGoals() {
    return this.goalsService.countGoals();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(Number(id));
  }
}
