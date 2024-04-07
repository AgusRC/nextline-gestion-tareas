import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDTO } from 'src/dtos/task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenData } from 'src/decorators/token.decorator';
import { TokenInterface } from 'src/interfaces/token-interface.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  async getTaskById(
    @Param('taskId') taskId: number,
    @TokenData() token: TokenInterface,
  ) {
    return await this._tasksService.getTaskDetail(taskId)
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('registerTask')
  async registreTask(
    @Body() taskdto: TaskDTO,
    @UploadedFile() file: Express.Multer.File,
    @TokenData() token: TokenInterface,
  ) {

    if(file) {
      if(
        !file.mimetype.includes('pdf') &&
        !file.mimetype.includes('jpg') &&
        !file.mimetype.includes('jpeg') &&
        !file.mimetype.includes('png')
      ) {
        throw new HttpException("file format not valid", HttpStatus.BAD_REQUEST)
      }
      if (file.size > 5*1024*1024) 
        throw new HttpException("file must be <5Mb", HttpStatus.BAD_REQUEST)

      taskdto.file = Buffer.from(file.buffer).toString('hex');
      taskdto.filename = file.originalname;
    }

    taskdto.userId = token.userid;
    return await this._tasksService.createTask(taskdto);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put('editTask/:taskId')
  async editTask(
    @Param('taskId') taskId: number,
    @Body() taskdto: TaskDTO,
    @UploadedFile() file: Express.Multer.File
  ) {

    if(file) {
      if(
        !file.mimetype.includes('pdf') &&
        !file.mimetype.includes('jpg') &&
        !file.mimetype.includes('jpeg') &&
        !file.mimetype.includes('png')
      ) {
        throw new HttpException("file format not valid", HttpStatus.BAD_REQUEST)
      }
      if (file.size > 5*1024*1024) 
        throw new HttpException("file must be <5Mb", HttpStatus.BAD_REQUEST)

      taskdto.file = Buffer.from(file.buffer).toString('hex');
      taskdto.filename = file.originalname;
    }
    
    return await this._tasksService.updateTask(taskId, taskdto);
  }

  @Delete('task/:taskId')
  async deleteTask( @Param('taskId') taskId: number ) {
    return await this._tasksService.deleteTask(taskId);
  }

  @Get("binnacles/:taskId/pageSize/:pageSize/pageNumber/:pageNumber")
  async binnaclesOfTask( 
    @Param('taskId') taskId: number,
    @Param('pageSize') pageSize: number,
    @Param('pageNumber') pageNumber: number,
   ) {
    return await this._tasksService.getBinnaclesOfTask(taskId, {pageSize, pageNumber})
  }
}
