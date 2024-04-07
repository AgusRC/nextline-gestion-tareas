import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { userDTO } from 'src/dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
  ) {}

  @Post('register')
  async registerUser(@Body() userDto: userDTO) {
    return await this._usersService.registerUser(userDto);
  }
}
