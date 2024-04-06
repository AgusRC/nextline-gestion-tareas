import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDTO } from 'src/dtos/task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly _tasksService: TasksService,
  ) {}

  @Get('allTasks/pageSize/:pageSize/pageNumber/:pageNumber')
  async getAllTasks(
    @Param('pageSize') pageSize: number,
    @Param('pageNumber') pageNumber: number,
  ) {
    return await this._tasksService.getAllTask({pageSize, pageNumber});
  }

  @Get("task/:taskId")
  async getTaskById(@Param('taskId') taskId: number) {
    return await this._tasksService.getTaskDetail(taskId)
  }

  //@UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('registerTask')
  async registreTask(
    @Body() taskdto: TaskDTO,
    @UploadedFile() file: Express.Multer.File
  ) {
    if(file) {
      console.log("file")
      taskdto.file = Buffer.from(file.buffer).toString('hex');
    }
    return await this._tasksService.createTask(taskdto);
  }
}
