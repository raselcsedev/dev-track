
import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

describe('DashboardController', () => {
  let controller: DashboardController;

  const mockDashboardService = {
    getOverview: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return dashboard overview for the authenticated user', async () => {
    const userId = 1;

    const mockOverview = {
      goals: { total: 10, completed: 6, pending: 4 },
      tasks: { total: 20, completed: 14, pending: 6 },
      projects: {
        total: 4,
        completed: 2,
        averageProgress: 62,
      },
      recentTasks: [],
      recentProjects: [],
    };

    mockDashboardService.getOverview.mockResolvedValue(mockOverview);

    const result = await controller.getOverview(userId);

    expect(mockDashboardService.getOverview).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockOverview);
  });
});
