
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrismaService = {
    goal: {
      count: vi.fn(),
    },
    task: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    project: {
      count: vi.fn(),
      aggregate: vi.fn(),
      findMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard overview for a user', async () => {
    const userId = 1;

    mockPrismaService.goal.count
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(6);

    mockPrismaService.task.count
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(14);

    mockPrismaService.project.count
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);

    mockPrismaService.project.aggregate.mockResolvedValue({
      _avg: { progress: 62.4 },
    });

    mockPrismaService.task.findMany.mockResolvedValue([
      { id: 1, title: 'Learn NestJS' },
    ]);

    mockPrismaService.project.findMany.mockResolvedValue([
      { id: 1, title: 'DevTrack' },
    ]);

    const result = await service.getOverview(userId);

    expect(result).toEqual({
      goals: {
        total: 10,
        completed: 6,
        pending: 4,
      },
      tasks: {
        total: 20,
        completed: 14,
        pending: 6,
      },
      projects: {
        total: 4,
        completed: 2,
        averageProgress: 62,
      },
      recentTasks: [
        { id: 1, title: 'Learn NestJS' },
      ],
      recentProjects: [
        { id: 1, title: 'DevTrack' },
      ],
    });
  });

  it('should scope all database queries by userId', async () => {
    const userId = 5;

    mockPrismaService.goal.count.mockResolvedValue(0);
    mockPrismaService.task.count.mockResolvedValue(0);
    mockPrismaService.project.count.mockResolvedValue(0);

    mockPrismaService.project.aggregate.mockResolvedValue({
      _avg: { progress: null },
    });

    mockPrismaService.task.findMany.mockResolvedValue([]);
    mockPrismaService.project.findMany.mockResolvedValue([]);

    await service.getOverview(userId);

    expect(mockPrismaService.goal.count).toHaveBeenCalledWith({
      where: { userId },
    });

    expect(mockPrismaService.task.count).toHaveBeenCalledWith({
      where: { userId },
    });

    expect(mockPrismaService.project.count).toHaveBeenCalledWith({
      where: { userId },
    });

    expect(mockPrismaService.project.aggregate).toHaveBeenCalledWith({
      where: { userId },
      _avg: { progress: true },
    });

    expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    expect(mockPrismaService.project.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  });
});
