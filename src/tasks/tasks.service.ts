import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskDTO } from 'src/dtos/task.dto';
import { Task, TaskStatus } from 'src/entities/task.entity';
import { PaginationTaskInterface, TaskInterface } from 'src/interfaces/task-interface.interface';
import { DataSource } from 'typeorm';

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
          title: taskdto.title
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

      await queryRunner.manager.save(newTask);

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

      taskToUpdate.comments = taskdto.comments ? taskdto.comments : "";
      taskToUpdate.tags = taskdto.tags ? taskdto.tags : "";
      taskToUpdate.file = taskdto.file ? taskdto.file : null;

      taskToUpdate.status = taskdto.status ? taskdto.status : taskToUpdate.status

      taskToUpdate.updatedDate = new Date().toISOString();

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
        skip: params.pageSize * (params.pageNumber-1)
      });

      let totalTasksCount = await queryRunner.manager.count(Task, {});
      let pages = Math.ceil(totalTasksCount / params.pageSize)

      await queryRunner.commitTransaction();

      let responseTasks: PaginationTaskInterface = {
        page: params.pageNumber,
        page_size: params.pageSize,
        total_pages: pages,
        tasks: []
      }

      for (let index = 0; index < allTask.length; index++) {
        const element = allTask[index];

        let tasksInterface: TaskInterface = {
          id: element.id,
          title: element.title,
          description: element.description,
          deadline: element.deadline,
          comments: element.comments,
          status: element.status,
          tags: element.tags
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
        where: {id: taskId}
      });

      if(!task) 
        throw new HttpException("task id = " + taskId + " not found", HttpStatus.NOT_FOUND);

      await queryRunner.commitTransaction();
      return task;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
