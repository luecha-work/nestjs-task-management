import { User } from './../auth/entity/user.entity';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { Body, Param, Patch, Query } from '@nestjs/common/decorators';
import { TasksService } from './tasks.service';
import { Controller, Get, Post, Delete, Logger } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import UpdateTaskStatusDto from './dto/update-task-status.dto';
import { Task } from './entity/task.entity';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { GetUser } from './../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );

    console.log('user: ', user);

    return this.tasksService.getTasks(filterDto, user);
  }

  //http:/localhost:3000/api/task/sd1sa2d1
  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post('/create') //http:/localhost:3000/api/task/create
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" create a new. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
