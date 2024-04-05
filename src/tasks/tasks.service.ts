import { Injectable } from '@nestjs/common';
import { TaskDTO } from 'src/dtos/task.dto';
import { Task } from 'src/entities/task.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    private readonly dataSource: DataSource,
  ){}

  async createTask(taskdto: TaskDTO): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //
      let newTask = new Task();
      newTask.title = taskdto.title;
      newTask.description = taskdto.description;
      newTask.deadline = new Date(taskdto.deadline).toISOString();

      newTask.comments = taskdto.comments ? taskdto.comments : "";
      newTask.tags = taskdto.tags ? taskdto.tags : "";

      await queryRunner.manager.save(newTask);

      await queryRunner.commitTransaction();
      return newTask
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
