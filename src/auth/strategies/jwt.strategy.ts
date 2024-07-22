import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Указывает, что JWT будет извлекаться из заголовка авторизации в формате Bearer
      ignoreExpiration: false, // Указывает, что истекшие токены должны быть отклонены
      secretOrKey: 'SECRET_JWT_KEY', // Секретный ключ для подписи и проверки JWT. В реальных приложениях лучше хранить его в переменных окружения
    });
  }

  async validate(payload: any) {
    // payload - это декодированный JWT
    const user = await this.usersService.findUserById(payload.sub); // Поиск пользователя в базе данных по идентификатору из полезной нагрузки
    return user;
  }
}
