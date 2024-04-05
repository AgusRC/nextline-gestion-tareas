import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDTO } from 'src/dtos/task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly _tasksService: TasksService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('registerTask')
  async registreTask(@Body() taskdto: TaskDTO) {
    return await this._tasksService.createTask(taskdto);
  }
}
