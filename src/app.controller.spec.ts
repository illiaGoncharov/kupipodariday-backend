import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  // Этот блок выполняется перед каждым тестом
  beforeEach(async () => {
    // Создаем тестовый модуль с AppController и AppService
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    // Получаем экземпляр AppController из тестового модуля
    appController = app.get<AppController>(AppController);
  });

  // Описываем группу тестов для корневого маршрута
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
