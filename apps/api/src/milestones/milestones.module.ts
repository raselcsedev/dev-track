import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service.js';
import { MilestonesController } from './milestones.controller.js';

@Module({
  providers: [MilestonesService],
  controllers: [MilestonesController],
})
export class MilestonesModule {}