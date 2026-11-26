
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  const mockProjectsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a project', async () => {
    const dto = { title: 'DevTrack Project' };
    const result = { id: 1, ...dto, userId: 2 };

    mockProjectsService.create.mockResolvedValue(result);

    expect(await controller.create(2, dto)).toEqual(result);
    expect(mockProjectsService.create).toHaveBeenCalledWith(2, dto);
  });

  it('should return all projects', async () => {
    const result = [{ id: 1, title: 'DevTrack Project', userId: 2 }];

    mockProjectsService.findAll.mockResolvedValue(result);

    expect(await controller.findAll(2)).toEqual(result);
    expect(mockProjectsService.findAll).toHaveBeenCalledWith(2);
  });

  it('should return a single project', async () => {
    const result = { id: 1, title: 'DevTrack Project', userId: 2 };

    mockProjectsService.findOne.mockResolvedValue(result);

    expect(await controller.findOne(1, 2)).toEqual(result);
    expect(mockProjectsService.findOne).toHaveBeenCalledWith(1, 2);
  });

  it('should update a project', async () => {
    const dto = { title: 'Updated Project' };
    const result = { id: 1, ...dto, userId: 2 };

    mockProjectsService.update.mockResolvedValue(result);

    expect(await controller.update(1, 2, dto)).toEqual(result);
    expect(mockProjectsService.update).toHaveBeenCalledWith(1, 2, dto);
  });

  it('should delete a project', async () => {
    const result = { id: 1, title: 'DevTrack Project', userId: 2 };

    mockProjectsService.remove.mockResolvedValue(result);

    expect(await controller.remove(1, 2)).toEqual(result);
    expect(mockProjectsService.remove).toHaveBeenCalledWith(1, 2);
  });
});

