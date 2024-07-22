import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // Внедрение сервиса AppService через конструктор
  constructor(private readonly appService: AppService) {}

  // Обработчик HTTP GET запросов на корневом маршруте ('/')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
