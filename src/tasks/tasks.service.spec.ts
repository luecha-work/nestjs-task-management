import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task.status.enum';
import { TasksRepository } from './entity/task.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');

      const result = await tasksService.getTasks(
        { status: TaskStatus.DONE, search: 'Hello' },
        mockUser,
      );

      console.log(`getTasks result: ${result}`);

      expect(result).toEqual('someValue');
    });

    it('returns an empty array if no tasks match the criteria', async () => {
      tasksRepository.getTasks.mockResolvedValue([]);

      const result = await tasksService.getTasks(
        { status: TaskStatus.DONE, search: 'Hello' },
        mockUser,
      );

      expect(result).toEqual([]);
    });

    it('throws an error if the call to tasksRepository.getTasks fails', async () => {
      tasksRepository.getTasks.mockRejectedValue(
        new Error('Something went wrong'),
      );

      expect(async () => {
        await tasksService.getTasks(
          { status: TaskStatus.DONE, search: 'Hello' },
          mockUser,
        );
      }).rejects.toThrow('Something went wrong');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
