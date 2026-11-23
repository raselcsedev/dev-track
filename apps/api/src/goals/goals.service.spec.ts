// import { Test, TestingModule } from '@nestjs/testing';
// import { GoalsService } from './goals.service.js';

// describe('GoalsService', () => {
//   let service: GoalsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [GoalsService],
//     }).compile();

//     service = module.get<GoalsService>(GoalsService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from './goals.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('GoalsService', () => {
  let service: GoalsService;

  const prismaMock = {
    goal: {
      create: vi.fn(),
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoalsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new goal', async () => {
      const userId = 2;

      const createGoalDto = {
        title: 'Learn Unit Testing',
        description: 'Learn Vitest with NestJS',
      };

      const mockGoal = {
        id: 4,
        title: 'Learn Unit Testing',
        description: 'Learn Vitest with NestJS',
        completed: false,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.goal.create.mockResolvedValue(mockGoal);

      const result = await service.create(userId, createGoalDto);

      expect(prismaMock.goal.create).toHaveBeenCalledWith({
        data: {
          title: createGoalDto.title,
          description: createGoalDto.description,
          completed: false,
          userId,
        },
      });

      expect(result).toEqual(mockGoal);
    });
    it('should throw an error when database creation fails', async () => {
      const userId = 2;

      const createGoalDto = {
        title: 'Learn Unit Testing',
        description: 'Learn Vitest with NestJS',
      };

      const databaseError = new Error('Database connection failed');

      prismaMock.goal.create.mockRejectedValue(databaseError);

      await expect(service.create(userId, createGoalDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
  describe('findOne', () => {
    it('should return a goal when found', async () => {
      const mockGoal = {
        id: 4,
        title: 'Learn Unit Testing',
        description: 'Learn Vitest with NestJS',
        completed: false,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.goal.findFirst.mockResolvedValue(mockGoal);

      const result = await service.findOne(2, 4);

      expect(prismaMock.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: 4,
          userId: 2,
        },
      });

      expect(result).toEqual(mockGoal);
    });

    it('should throw NotFoundException when goal does not exist', async () => {
      prismaMock.goal.findFirst.mockResolvedValue(null);

      await expect(service.findOne(2, 999)).rejects.toThrow(
        'Goal with ID 999 not found',
      );
    });
  });
  describe('update', () => {
    it('should update a goal successfully', async () => {
      const updateGoalDto = {
        title: 'Learn Advanced NestJS',
      };

      const mockGoal = {
        id: 4,
        title: 'Learn Advanced NestJS',
        description: 'Learn Vitest with NestJS',
        completed: false,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.goal.updateMany.mockResolvedValue({ count: 1 });
      prismaMock.goal.findFirst.mockResolvedValue(mockGoal);

      const result = await service.update(2, 4, updateGoalDto);

      expect(prismaMock.goal.updateMany).toHaveBeenCalledWith({
        where: {
          id: 4,
          userId: 2,
        },
        data: updateGoalDto,
      });

      expect(result).toEqual(mockGoal);
    });

    it('should throw NotFoundException when goal does not exist', async () => {
      prismaMock.goal.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.update(2, 999, { title: 'Updated Goal' }),
      ).rejects.toThrow('Goal with ID 999 not found');
    });
  });
  describe('remove', () => {
  it('should delete a goal successfully', async () => {
    const mockGoal = {
      id: 4,
      title: 'Learn Unit Testing',
      description: 'Learn Vitest with NestJS',
      completed: false,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.goal.findFirst.mockResolvedValue(mockGoal);
    prismaMock.goal.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.remove(2, 4);

    expect(prismaMock.goal.findFirst).toHaveBeenCalledWith({
      where: {
        id: 4,
        userId: 2,
      },
    });

    expect(prismaMock.goal.deleteMany).toHaveBeenCalledWith({
      where: {
        id: 4,
        userId: 2,
      },
    });

    expect(result).toEqual({
      message: 'Goal deleted successfully',
      data: mockGoal,
    });
  });

  it('should throw NotFoundException when goal does not exist', async () => {
    prismaMock.goal.findFirst.mockResolvedValue(null);

    await expect(service.remove(2, 999))
      .rejects.toThrow('Goal with ID 999 not found');

    expect(prismaMock.goal.deleteMany).not.toHaveBeenCalled();
  });
});
});
