
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: number) {
    const [
      totalGoals,
      completedGoals,
      totalTasks,
      completedTasks,
      totalProjects,
      completedProjects,
      projectsProgress,
      recentTasks,
      recentProjects,
    ] = await Promise.all([
      this.prisma.goal.count({
        where: { userId },
      }),

      this.prisma.goal.count({
        where: { userId, completed: true },
      }),

      this.prisma.task.count({
        where: { userId },
      }),

      this.prisma.task.count({
        where: { userId, completed: true },
      }),

      this.prisma.project.count({
        where: { userId },
      }),

      this.prisma.project.count({
        where: { userId, status: 'COMPLETED' },
      }),

      this.prisma.project.aggregate({
        where: { userId },
        _avg: { progress: true },
      }),

      this.prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      this.prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      goals: {
        total: totalGoals,
        completed: completedGoals,
        pending: totalGoals - completedGoals,
      },

      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: totalTasks - completedTasks,
      },

      projects: {
        total: totalProjects,
        completed: completedProjects,
        averageProgress: Math.round(
          projectsProgress._avg.progress ?? 0,
        ),
      },

      recentTasks,
      recentProjects,
    };
  }
}
