import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDTO } from 'src/dtos/task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenData } from 'src/decorators/token.decorator';
import { TokenInterface } from 'src/interfaces/token-interface.interface';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParamsDTO } from 'src/dtos/params.dto';
import { title } from 'process';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly _tasksService: TasksService,
  ) {}

  @ApiOperation({
    summary: 'Obtiene todos los registros de tareas',
  })
  @Get('allTasks/pageSize/:pageSize/pageNumber/:pageNumber')
  async getAllTasks(
    @Param('pageSize') pageSize: number,
    @Param('pageNumber') pageNumber: number,
  ) {
    return await this._tasksService.getAllTask({pageSize, pageNumber});
  }

  @ApiOperation({
    summary: 'Obtiene los detalles de una tarea por su Id',
  })
  @Get("task/:taskId")
  async getTaskById(
    @Param('taskId') taskId: number,
    @TokenData() token: TokenInterface,
  ) {
    return await this._tasksService.getTaskDetail(taskId)
  }

  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'registra una nueva tarea',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string'  },
        description: { type: 'string' },
        deadline: { type: 'string', example: "2024-04-10T00:00:00.359Z" },
        comments: { type: 'string', nullable: true },
        tags: { type: 'string', nullable: true },
        file: {
          type: 'string',
          format: 'binary',
          nullable: true
        },
      },
    },
  })
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

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        deadline: { type: 'string',  example: "2024-04-10T00:00:00.359Z" },
        comments: { type: 'string', nullable: true },
        tags: { type: 'string', nullable: true },
        file: {
          type: 'string',
          format: 'binary',
          nullable: true
        },
        status: { type: 'string', nullable: true, enum: ['pending', 'in progress', 'complete'] },
      },
    },
  })
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

  @ApiOperation({
    summary: 'elimina una tarea segun su Id',
  })
  @Delete('task/:taskId')
  async deleteTask( @Param('taskId') taskId: number ) {
    return await this._tasksService.deleteTask(taskId);
  }


  @ApiOperation({
    summary: 'Obtiene todos las bitacoras de una tarea, por id de tarea',
  })
  @Get("binnacles/:taskId/pageSize/:pageSize/pageNumber/:pageNumber")
  async binnaclesOfTask( 
    @Param('taskId') taskId: number,
    @Param('pageSize') pageSize: number,
    @Param('pageNumber') pageNumber: number,
   ) {
    return await this._tasksService.getBinnaclesOfTask(taskId, {pageSize, pageNumber})
  }

  @ApiOperation({
    summary: 'Obtiene todos los registros de tareas segun los filtros',
  })
  @Get('allTasks/pageSize/:pageSize/pageNumber/:pageNumber/keyword/:keyword/status/:status/daysleft/:daysleft/fileFormat/:fileFormat')
  async getFilteredTasks(
    @Param('pageSize') pageSize: number,
    @Param('pageNumber') pageNumber: number,
    @Param('keyword') keyword?: string,
    @Param('status') status?: string,
    @Param('daysleft') daysleft?: string,
    @Param('fileFormat') fileFormat?: string,
  ) {
    let params: ParamsDTO = {
      pageSize: pageSize,
      pageNumber: pageNumber,
      keyword: keyword,
      status: status,
      daysleft: daysleft,
      fileFormat: fileFormat
    }
    return await this._tasksService.getAllTask(params);
  }
}
