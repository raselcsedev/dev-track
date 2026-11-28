
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMilestoneDto } from './dto/create-milestone.dto.js';
import { UpdateMilestoneDto } from './dto/update-milestone.dto.js';

@Injectable()
export class MilestonesService {
  constructor(private readonly prisma: PrismaService) {}

  // Verify project ownership
  private async verifyProject(projectId: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // Create milestone
  async create(
    projectId: number,
    userId: number,
    createMilestoneDto: CreateMilestoneDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({
        where: { id: projectId, userId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const milestone = await tx.milestone.create({
        data: {
          ...createMilestoneDto,
          dueDate: createMilestoneDto.dueDate
            ? new Date(createMilestoneDto.dueDate)
            : null,
          projectId,
        },
      });

      const [total, completed] = await Promise.all([
        tx.milestone.count({ where: { projectId } }),
        tx.milestone.count({
          where: { projectId, status: 'COMPLETED' },
        }),
      ]);

      await tx.project.update({
        where: { id: projectId },
        data: {
          progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
      });

      return milestone;
    });
  }

  // Get all milestones of a project
  async findAll(projectId: number, userId: number) {
    await this.verifyProject(projectId, userId);

    return this.prisma.milestone.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // Update milestone
  async update(
    id: number,
    projectId: number,
    userId: number,
    updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({
        where: { id: projectId, userId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const existingMilestone = await tx.milestone.findFirst({
        where: { id, projectId },
      });

      if (!existingMilestone) {
        throw new NotFoundException('Milestone not found');
      }

      const milestone = await tx.milestone.update({
        where: { id },
        data: {
          ...updateMilestoneDto,
          dueDate:
            updateMilestoneDto.dueDate !== undefined
              ? updateMilestoneDto.dueDate
                ? new Date(updateMilestoneDto.dueDate)
                : null
              : undefined,
        },
      });

      const [total, completed] = await Promise.all([
        tx.milestone.count({ where: { projectId } }),
        tx.milestone.count({
          where: { projectId, status: 'COMPLETED' },
        }),
      ]);

      await tx.project.update({
        where: { id: projectId },
        data: {
          progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
      });

      return milestone;
    });
  }

  // Delete milestone
  async remove(id: number, projectId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({
        where: { id: projectId, userId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const existingMilestone = await tx.milestone.findFirst({
        where: { id, projectId },
      });

      if (!existingMilestone) {
        throw new NotFoundException('Milestone not found');
      }

      const milestone = await tx.milestone.delete({
        where: { id },
      });

      const [total, completed] = await Promise.all([
        tx.milestone.count({ where: { projectId } }),
        tx.milestone.count({
          where: { projectId, status: 'COMPLETED' },
        }),
      ]);

      await tx.project.update({
        where: { id: projectId },
        data: {
          progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
      });

      return milestone;
    });
  }
}
