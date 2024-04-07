import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    let isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    let isMatch = await bcrypt.compare(pass, user.pass);
    if (user && isMatch) {
      const { pass, ...result } = user;
      return result;
    }
    return null;
  }
  

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
