
import { Test, TestingModule } from '@nestjs/testing';
import { MilestonesController } from './milestones.controller.js';
import { MilestonesService } from './milestones.service.js';

describe('MilestonesController', () => {
  let controller: MilestonesController;

  const mockMilestonesService = {
    create: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MilestonesController],
      providers: [
        {
          provide: MilestonesService,
          useValue: mockMilestonesService,
        },
      ],
    }).compile();

    controller = module.get<MilestonesController>(MilestonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a milestone', async () => {
    const dto = { title: 'API Development' };
    const result = {
      id: 1,
      ...dto,
      projectId: 10,
      status: 'PENDING',
    };

    mockMilestonesService.create.mockResolvedValue(result);

    expect(await controller.create(10, 2, dto)).toEqual(result);

    expect(mockMilestonesService.create).toHaveBeenCalledWith(
      10,
      2,
      dto,
    );
  });

  it('should return all milestones', async () => {
    const result = [
      { id: 1, title: 'API Development', projectId: 10 },
    ];

    mockMilestonesService.findAll.mockResolvedValue(result);

    expect(await controller.findAll(10, 2)).toEqual(result);

    expect(mockMilestonesService.findAll).toHaveBeenCalledWith(10, 2);
  });

  it('should update a milestone', async () => {
    const dto = { title: 'Updated milestone' };
    const result = {
      id: 1,
      ...dto,
      projectId: 10,
    };

    mockMilestonesService.update.mockResolvedValue(result);

    expect(await controller.update(10, 1, 2, dto)).toEqual(result);

    expect(mockMilestonesService.update).toHaveBeenCalledWith(
      1,
      10,
      2,
      dto,
    );
  });

  it('should delete a milestone', async () => {
    const result = {
      id: 1,
      title: 'API Development',
      projectId: 10,
    };

    mockMilestonesService.remove.mockResolvedValue(result);

    expect(await controller.remove(10, 1, 2)).toEqual(result);

    expect(mockMilestonesService.remove).toHaveBeenCalledWith(
      1,
      10,
      2,
    );
  });
});
