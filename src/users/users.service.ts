
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { userDTO } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
  ){}

  async findOne(username: string): Promise<User | undefined> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //
      let user = await queryRunner.manager.findOne(User, {
        where: { name: username }
      });

      return user;
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async registerUser(userdto: userDTO) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if(await queryRunner.manager.findOne(User, {where: {name: userdto.name}}))
        throw new HttpException("name is already in use", HttpStatus.BAD_REQUEST);

      let newUser = new User();
      newUser.name = userdto.name;
      newUser.pass = await this.hashPassword(userdto.pass);

      await queryRunner.manager.save(newUser);

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

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
