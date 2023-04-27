import { TaskStatus } from '../task.status.enum';
import { IsEnum } from 'class-validator';

export default class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
