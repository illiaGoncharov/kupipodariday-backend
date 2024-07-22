import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService, // Внедрение AuthService для работы с аутентификацией
    private usersService: UsersService, // Внедрение UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async loginUser(@Request() req): Promise<SigninUserResponseDto> {
    // req.user будет содержать пользователя, прошедшего аутентификацию, благодаря LocalAuthGuard
    return this.authService.loginUser(req.user);
  }

  @Post('signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    // Вызов метода createUser из UsersService для создания нового пользователя
    const user = await this.usersService.createUser(createUserDto);
    // Автоматический вход пользователя после успешной регистрации
    return this.authService.loginUser(user);
  }
}
