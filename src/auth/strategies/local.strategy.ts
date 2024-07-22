import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    // Вызов метода validatePassword из AuthService для проверки правильности имени пользователя и пароля
    const user = await this.authService.validatePassword({
      username,
      password,
    });
    if (!user) {
      throw new UnauthorizedException('Некорректный логин или пароль');
    }
    return user;
  }
}
