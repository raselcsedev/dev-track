
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MilestonesService } from './milestones.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MilestoneStatus } from './dto/create-milestone.dto.js';

describe('MilestonesService', () => {
  let service: MilestonesService;

  const mockTx = {
    project: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    milestone: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  };

  const mockPrismaService = {
    ...mockTx,
    $transaction: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockPrismaService.$transaction.mockImplementation(
      (callback) => callback(mockTx),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MilestonesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MilestonesService>(MilestonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a milestone and update project progress', async () => {
    const dto = {
      title: 'API Development',
      description: 'Build REST API',
    };

    const result = {
      id: 1,
      ...dto,
      projectId: 10,
      status: 'PENDING',
    };

    mockTx.project.findFirst.mockResolvedValue({
      id: 10,
      userId: 2,
    });

    mockTx.milestone.create.mockResolvedValue(result);
    mockTx.milestone.count
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);

    mockTx.project.update.mockResolvedValue({
      id: 10,
      progress: 50,
    });

    expect(await service.create(10, 2, dto)).toEqual(result);

    expect(mockTx.milestone.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        dueDate: null,
        projectId: 10,
      },
    });

    expect(mockTx.project.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { progress: 50 },
    });
  });

  it('should throw NotFoundException when creating milestone for another user project', async () => {
    mockTx.project.findFirst.mockResolvedValue(null);

    await expect(
      service.create(10, 2, { title: 'API Development' }),
    ).rejects.toThrow(NotFoundException);

    expect(mockTx.milestone.create).not.toHaveBeenCalled();
  });

  it('should return all milestones for a project', async () => {
    const result = [
      { id: 1, title: 'API Development', projectId: 10 },
    ];

    mockPrismaService.project.findFirst.mockResolvedValue({
      id: 10,
      userId: 2,
    });

    mockPrismaService.milestone.findMany.mockResolvedValue(result);

    expect(await service.findAll(10, 2)).toEqual(result);

    expect(mockPrismaService.milestone.findMany).toHaveBeenCalledWith({
      where: { projectId: 10 },
      orderBy: { createdAt: 'asc' },
    });
  });

  it('should throw NotFoundException when listing milestones for another user project', async () => {
    mockPrismaService.project.findFirst.mockResolvedValue(null);

    await expect(service.findAll(10, 2)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockPrismaService.milestone.findMany).not.toHaveBeenCalled();
  });

  it('should update a milestone and recalculate project progress', async () => {
    const existingMilestone = {
      id: 1,
      title: 'API Development',
      projectId: 10,
    };

    const dto = { status: MilestoneStatus.COMPLETED };

    const result = {
      ...existingMilestone,
      ...dto,
    };

    mockTx.project.findFirst.mockResolvedValue({
      id: 10,
      userId: 2,
    });

    mockTx.milestone.findFirst.mockResolvedValue(existingMilestone);
    mockTx.milestone.update.mockResolvedValue(result);

    mockTx.milestone.count
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);

    mockTx.project.update.mockResolvedValue({
      id: 10,
      progress: 50,
    });

    expect(await service.update(1, 10, 2, dto)).toEqual(result);

    expect(mockTx.project.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { progress: 50 },
    });
  });

  it('should throw NotFoundException when updating a nonexistent milestone', async () => {
    mockTx.project.findFirst.mockResolvedValue({
      id: 10,
      userId: 2,
    });

    mockTx.milestone.findFirst.mockResolvedValue(null);

    await expect(
      service.update(999, 10, 2, { title: 'Updated milestone' }),
    ).rejects.toThrow(NotFoundException);

    expect(mockTx.milestone.update).not.toHaveBeenCalled();
  });

  it('should delete a milestone and recalculate project progress', async () => {
    const existingMilestone = {
      id: 1,
      title: 'API Development',
      projectId: 10,
    };

    mockTx.project.findFirst.mockResolvedValue({
      id: 10,
      userId: 2,
    });

    mockTx.milestone.findFirst.mockResolvedValue(existingMilestone);
    mockTx.milestone.delete.mockResolvedValue(existingMilestone);

    mockTx.milestone.count
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(3);

    mockTx.project.update.mockResolvedValue({
      id: 10,
      progress: 100,
    });

    expect(await service.remove(1, 10, 2)).toEqual(existingMilestone);

    expect(mockTx.project.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { progress: 100 },
    });
  });

  it('should reset project progress to zero when no milestones remain', async () => {
    mockTx.project.findFirst.mockResolvedValue({
      id: 10,
      userId: 2,
    });

    mockTx.milestone.findFirst.mockResolvedValue({
      id: 1,
      projectId: 10,
    });

    mockTx.milestone.delete.mockResolvedValue({
      id: 1,
      projectId: 10,
    });

    mockTx.milestone.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);

    await service.remove(1, 10, 2);

    expect(mockTx.project.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { progress: 0 },
    });
  });

  it('should throw NotFoundException when deleting a nonexistent milestone', async () => {
    mockTx.project.findFirst.mockResolvedValue({
      id: 10,
      userId: 2,
    });

    mockTx.milestone.findFirst.mockResolvedValue(null);

    await expect(service.remove(999, 10, 2)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockTx.milestone.delete).not.toHaveBeenCalled();
  });
});
