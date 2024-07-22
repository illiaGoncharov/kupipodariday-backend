import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { SignInUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async loginUser(user: User) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Метод для проверки правильности пароля пользователя
  async validatePassword(signInUserDto: SignInUserDto) {
    const user = await this.usersService.findUserByName(signInUserDto.username);
    // Сравнение предоставленного пароля с сохранённым хешем пароля
    const validate = await bcrypt.compare(
      signInUserDto.password,
      user.password,
    );
    if (validate) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
