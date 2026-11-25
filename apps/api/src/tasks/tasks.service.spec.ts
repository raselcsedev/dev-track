
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('TasksService', () => {
  let service: TasksService;

  const prismaMock = {
    task: {
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
        TasksService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const userId = 2;

      const createTaskDto = {
        title: 'Learn NestJS Testing',
        description: 'Practice unit testing with Vitest',
        dueDate: '2026-11-30T18:00:00.000Z',
      };

      const mockTask = {
        id: 1,
        ...createTaskDto,
        dueDate: new Date(createTaskDto.dueDate),
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.task.create.mockResolvedValue(mockTask);

      const result = await service.create(userId, createTaskDto);

      expect(prismaMock.task.create).toHaveBeenCalledWith({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          dueDate: new Date(createTaskDto.dueDate),
          userId,
        },
      });

      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks belonging to a user', async () => {
      const userId = 2;

      const mockTasks = [
        {
          id: 1,
          title: 'Learn NestJS',
          description: null,
          completed: false,
          dueDate: null,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.findAll(userId);

      expect(prismaMock.task.findMany).toHaveBeenCalledWith({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual(mockTasks);
    });
  });

  describe('findOne', () => {
    it('should return a task when found', async () => {
      const mockTask = {
        id: 1,
        title: 'Learn NestJS',
        description: null,
        completed: false,
        dueDate: null,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.task.findFirst.mockResolvedValue(mockTask);

      const result = await service.findOne(1, 2);

      expect(prismaMock.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: 2,
        },
      });

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      prismaMock.task.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999, 2)).rejects.toThrow(
        'Task not found',
      );
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto = {
        title: 'Learn Advanced NestJS',
        completed: true,
      };

      const existingTask = {
        id: 1,
        title: 'Learn NestJS',
        description: null,
        completed: false,
        dueDate: null,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTask = {
        ...existingTask,
        ...updateTaskDto,
      };

      prismaMock.task.findFirst.mockResolvedValue(existingTask);
      prismaMock.task.update.mockResolvedValue(updatedTask);

      const result = await service.update(1, 2, updateTaskDto);

      expect(prismaMock.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: 2,
        },
      });

      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: updateTaskDto,
      });

      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      prismaMock.task.findFirst.mockResolvedValue(null);

      await expect(
        service.update(999, 2, { title: 'Updated Task' }),
      ).rejects.toThrow('Task not found');

      expect(prismaMock.task.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const mockTask = {
        id: 1,
        title: 'Learn NestJS',
        description: null,
        completed: false,
        dueDate: null,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.task.findFirst.mockResolvedValue(mockTask);
      prismaMock.task.delete.mockResolvedValue(mockTask);

      const result = await service.remove(1, 2);

      expect(prismaMock.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: 2,
        },
      });

      expect(prismaMock.task.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      prismaMock.task.findFirst.mockResolvedValue(null);

      await expect(service.remove(999, 2)).rejects.toThrow(
        'Task not found',
      );

      expect(prismaMock.task.delete).not.toHaveBeenCalled();
    });
  });
});
