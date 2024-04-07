import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskDTO } from 'src/dtos/task.dto';
import { Binnacle } from 'src/entities/binnacle.entity';
import { Task, TaskStatus } from 'src/entities/task.entity';
import { BinnaclesInterface, PaginationBinnacleInterface } from 'src/interfaces/binnacles-interface.interface';
import { PaginationTaskInterface, TaskInterface } from 'src/interfaces/task-interface.interface';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    private readonly dataSource: DataSource,
  ){}

  async createTask(taskdto: TaskDTO): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //verificar existencia de title
      if(
        await queryRunner.manager.findOne(Task, {
        where: {
          title: taskdto.title,
          active: true
          }
        }
      )) throw new HttpException("title " + taskdto.title + " already exist", HttpStatus.BAD_REQUEST)

      let newTask = new Task();
      newTask.title = taskdto.title;
      newTask.description = taskdto.description;
      newTask.deadline = new Date(taskdto.deadline).toISOString();

      // verificar campos opcionales
      newTask.comments = taskdto.comments ? taskdto.comments : "";
      newTask.tags = taskdto.tags ? taskdto.tags : "";
      newTask.file = taskdto.file ? taskdto.file : null;
      newTask.filename = taskdto.filename ? taskdto.filename : null;

      await queryRunner.manager.save(newTask);

      // crear bitacora inicial
      this.registerBinnacle(queryRunner, newTask);

      await queryRunner.commitTransaction();
      return newTask.id
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async updateTask(taskId: number, taskdto: TaskDTO): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //
      let taskToUpdate = await queryRunner.manager.findOne(Task, { where: {id: taskId}});

      if(!taskToUpdate) 
        throw new HttpException("Task id = " + taskId + " not found", HttpStatus.NOT_FOUND)

      taskToUpdate.title = taskdto.title;
      taskToUpdate.description = taskdto.description;
      taskToUpdate.deadline = new Date(taskdto.deadline).toISOString();
      taskToUpdate.updatedDate = new Date().toISOString();

      taskToUpdate.comments = taskdto.comments ? taskdto.comments : "";
      taskToUpdate.tags = taskdto.tags ? taskdto.tags : "";
      taskToUpdate.file = taskdto.file ? taskdto.file : null;
      taskToUpdate.filename = taskdto.filename ? taskdto.filename : null;

     

      if(taskdto.status) {
        if(!Object.values(TaskStatus).includes(taskdto.status))
          throw new HttpException("status must be 'pending', 'in progress', or 'complete'", HttpStatus.BAD_REQUEST)
        taskToUpdate.status = taskdto.status
      }

      taskToUpdate.updatedDate = new Date().toISOString();

      // registrar bitacora
      this.registerBinnacle(queryRunner, taskToUpdate);

      await queryRunner.manager.update(Task, taskId, taskToUpdate)
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async getAllTask(params): Promise<PaginationTaskInterface> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let allTask = await queryRunner.manager.find(Task, {
        take: params.pageSize,
        skip: params.pageSize * (params.pageNumber-1),
        where: {active: true},
        select: ['id', 'title', 'description', 'status', 'deadline', 'comments', 'tags', 'filename' ]
      });

      let totalTasksCount = await queryRunner.manager.count(Task, {});

      await queryRunner.commitTransaction();

      let responseTasks: PaginationTaskInterface = {
        page: params.pageNumber,
        page_size: params.pageSize,
        total_pages: Math.ceil(totalTasksCount / params.pageSize),
        tasks: []
      }

      for (let index = 0; index < allTask.length; index++) {
        const element = allTask[index];

        let tasksInterface: TaskInterface = {
          id: element.id,
          title: element.title,
          deadline: element.deadline,
          status: element.status,
          filename: element.filename
        }

        responseTasks.tasks.push(tasksInterface)
      }

      return responseTasks
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async getTaskDetail(taskId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let task = await queryRunner.manager.findOne(Task, {
        where: {
          id: taskId,
          active: true
        }
      });

      if(!task) 
        throw new HttpException("task id = " + taskId + " not found", HttpStatus.NOT_FOUND);

      await queryRunner.commitTransaction();

      let taskResponse: TaskInterface = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        deadline: task.deadline,
        comments: task.comments,
        // createdBy
        tags: task.tags,
        filename: task.filename,
        file: task.file
      }

      return taskResponse;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteTask(taskId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let taskToDelete = await queryRunner.manager.findOne(Task, {
        where: {
          id: taskId,
          active: true,
        }
      })

      if(!taskToDelete) 
        throw new HttpException("task id = " + taskId + " not found", HttpStatus.NOT_FOUND);

      taskToDelete.active = false;
      taskToDelete.updatedDate = new Date().toISOString();

      await queryRunner.manager.save(taskToDelete);

      // registrar bitacora
      this.registerBinnacle(queryRunner, taskToDelete);

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async registerBinnacle(queryRunner: QueryRunner, task: Task) {
    try {
      let newBinnacle = new Binnacle();
      newBinnacle.task = task;

      // no guardar hex en json
      delete task.file;
      newBinnacle.history = JSON.stringify(task);
      await queryRunner.manager.save(newBinnacle);
    } catch (error) {
      throw error;
    }
  }

  async getBinnaclesOfTask(taskId: number, params) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //
      let task = await queryRunner.manager.findOne(Task, {
        where: {
          id: taskId,
        },
      })

      if(!task) throw new HttpException("task id = " + taskId + " not found", HttpStatus.NOT_FOUND);

      // obtener bitacoras
      let binnaclesOfTask = await queryRunner.manager.find(Binnacle, {
        //relations: ["task"],
        where: {
          task: task
        },
        select: ['id', 'createdDate', 'history'],
        take: params.pageSize,
        skip: params.pageSize * (params.pageNumber-1),
      })
      
      let totalBinnacles = await queryRunner.manager.count(Binnacle, {
        where: { task: task }
      })
      await queryRunner.commitTransaction();

      let responseBinnacles: PaginationBinnacleInterface = {
        page: params.pageNumber,
        page_size: params.pageSize,
        total_pages: Math.ceil(totalBinnacles / params.pageSize),
        binnacles: []
      }

      for (let index = 0; index < binnaclesOfTask.length; index++) {
        const binnacle = binnaclesOfTask[index];
        
        responseBinnacles.binnacles.push({
          id: binnacle.id,
          createdDate: binnacle.createdDate,
          history: binnacle.history
        })
      }

      return responseBinnacles;
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }
}
