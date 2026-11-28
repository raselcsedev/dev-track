import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new project
  async create(userId: number, createProjectDto: CreateProjectDto) {
    const { title, description, status, startDate, endDate } = createProjectDto;

    return this.prisma.project.create({
      data: {
        title,
        description: description ?? null,
        status,
        progress: 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId,
      },
    });
  }

  // Get all projects of a user
  async findAll(userId: number) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single project
  async findOne(id: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // Update a project
  async update(id: number, userId: number, updateProjectDto: UpdateProjectDto) {
    const existingProject = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...updateProjectDto,
        startDate:
          updateProjectDto.startDate !== undefined
            ? updateProjectDto.startDate
              ? new Date(updateProjectDto.startDate)
              : null
            : undefined,
        endDate:
          updateProjectDto.endDate !== undefined
            ? updateProjectDto.endDate
              ? new Date(updateProjectDto.endDate)
              : null
            : undefined,
      },
    });
  }

  // Delete a project
  async remove(id: number, userId: number) {
    const existingProject = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
