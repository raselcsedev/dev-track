
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockPrismaService = {
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new project with zero progress', async () => {
    const dto = {
      title: 'DevTrack Project',
      description: 'Learning NestJS',
    };

    const result = {
      id: 1,
      ...dto,
      progress: 0,
      userId: 2,
    };

    mockPrismaService.project.create.mockResolvedValue(result);

    expect(await service.create(2, dto)).toEqual(result);

    expect(mockPrismaService.project.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description,
        status: undefined,
        progress: 0,
        startDate: null,
        endDate: null,
        userId: 2,
      },
    });
  });

  it('should return all projects for a user', async () => {
    const result = [
      { id: 1, title: 'DevTrack Project', userId: 2 },
    ];

    mockPrismaService.project.findMany.mockResolvedValue(result);

    expect(await service.findAll(2)).toEqual(result);

    expect(mockPrismaService.project.findMany).toHaveBeenCalledWith({
      where: { userId: 2 },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should return a single project', async () => {
    const result = {
      id: 1,
      title: 'DevTrack Project',
      userId: 2,
    };

    mockPrismaService.project.findFirst.mockResolvedValue(result);

    expect(await service.findOne(1, 2)).toEqual(result);
  });

  it('should throw NotFoundException when project does not exist', async () => {
    mockPrismaService.project.findFirst.mockResolvedValue(null);

    await expect(service.findOne(999, 2)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a project without changing its progress', async () => {
    const existingProject = {
      id: 1,
      title: 'Old Project',
      progress: 50,
      userId: 2,
    };

    const dto = {
      title: 'Updated Project',
    };

    const result = {
      ...existingProject,
      ...dto,
    };

    mockPrismaService.project.findFirst.mockResolvedValue(existingProject);
    mockPrismaService.project.update.mockResolvedValue(result);

    expect(await service.update(1, 2, dto)).toEqual(result);

    expect(mockPrismaService.project.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        ...dto,
        startDate: undefined,
        endDate: undefined,
      },
    });
  });

  it('should throw NotFoundException when updating a nonexistent project', async () => {
    mockPrismaService.project.findFirst.mockResolvedValue(null);

    await expect(
      service.update(999, 2, { title: 'Updated Project' }),
    ).rejects.toThrow(NotFoundException);

    expect(mockPrismaService.project.update).not.toHaveBeenCalled();
  });

  it('should delete a project', async () => {
    const existingProject = {
      id: 1,
      title: 'DevTrack Project',
      userId: 2,
    };

    mockPrismaService.project.findFirst.mockResolvedValue(existingProject);
    mockPrismaService.project.delete.mockResolvedValue(existingProject);

    expect(await service.remove(1, 2)).toEqual(existingProject);

    expect(mockPrismaService.project.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw NotFoundException when deleting a nonexistent project', async () => {
    mockPrismaService.project.findFirst.mockResolvedValue(null);

    await expect(service.remove(999, 2)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockPrismaService.project.delete).not.toHaveBeenCalled();
  });
});
