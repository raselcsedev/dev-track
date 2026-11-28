import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return tasks using query parameters', async () => {
      const userId = 2;

      const query = {
        search: 'NestJS',
        completed: true,
        page: 1,
        limit: 5,
      };

      const mockResponse = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 5,
          totalPages: 0,
        },
      };

      mockTasksService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(userId, query);

      expect(mockTasksService.findAll).toHaveBeenCalledWith(userId, query);

      expect(result).toEqual(mockResponse);
    });
  });
});
