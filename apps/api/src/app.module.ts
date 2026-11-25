// import { Module } from '@nestjs/common';
// import { createObserveModule } from '@nestjs/observe';
// import { AppController } from './app.controller.js';
// import { AppService } from './app.service.js';
// import { GoalsService } from './goals/goals.service.js';
// import { GoalsController } from './goals/goals.controller.js';
// import { GoalsModule } from './goals/goals.module.js';

// export const { ObserveModule, ObserveInstrument } = createObserveModule();

// @Module({
//  imports: [GoalsModule],
//   controllers: [AppController, GoalsController],
//   providers: [AppService, GoalsService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GoalsModule } from './goals/goals.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      enabled: false,
      serviceId: 'devtrack-api',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    GoalsModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
