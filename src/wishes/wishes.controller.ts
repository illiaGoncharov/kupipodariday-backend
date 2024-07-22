import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request as IRequest } from 'express';

import { WishesService } from './wishes.service';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

import { Wish } from './entities/wish.entity';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// Интерфейс с типом пользователя из запроса
interface RequestUser extends IRequest {
  user: UserProfileResponseDto;
}

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  // Создание нового желания с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(
    @Req() req: RequestUser, // Извлечение пользователя из запроса
    @Body() createWishDto: CreateWishDto, // DTO для создания желания
  ): Promise<Record<string, never>> {
    await this.wishesService.createWish(req.user.id, createWishDto);
    return {};
  }

  // Получение последнего
  @Get('last')
  async findLast(): Promise<Wish[]> {
    return await this.wishesService.findLast();
  }

  // Получение топового
  @Get('top')
  async findTop(): Promise<Wish[]> {
    return await this.wishesService.findTop();
  }

  // Получение желания по ID с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getWish(@Param('id') id: number) {
    return await this.wishesService.getWish(id);
  }

  // Обновление желания с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWish(
    @Req() req: RequestUser,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Record<string, never>> {
    await this.wishesService.updateWish(req.user, id, updateWishDto);
    return {};
  }

  // Удаление желания с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeWish(
    @Req() req: RequestUser, // Извлечение пользователя из запроса
    @Param('id') id: number, // ID удаляемого желания
  ): Promise<Wish> {
    return await this.wishesService.removeWish(req.user, id);
  }

  // Копирование желания с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(
    @Req() req: RequestUser, // Извлечение пользователя из запроса
    @Param('id') id: number, // ID копируемого желания
  ): Promise<Record<string, never>> {
    await this.wishesService.copyWish(req.user, id);
    return {};
  }
}
