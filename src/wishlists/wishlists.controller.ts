import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request as IRequest } from 'express';

import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';

import { CreateWishlistDto } from './dto/create-wishlist.dto';

interface RequestUser extends IRequest {
  user: UserProfileResponseDto;
}

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {} // Внедрение сервиса

  // Получение всех списков желаемого пользователя
  @UseGuards(JwtAuthGuard)
  @Get()
  async findWishlists(@Req() req: RequestUser): Promise<Wishlist[]> {
    return await this.wishlistsService.findWishlists(req.user);
  }

  // Создание нового списка желаемого с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Post()
  async createWishlist(
    @Req() req: RequestUser, // Получение пользователя из запроса
    @Body() createWishlistDto: CreateWishlistDto, // DTO для создания списка
  ): Promise<Wishlist> {
    return await this.wishlistsService.createWishlist(
      req.user, // Передача пользователя
      createWishlistDto, // Передача данных для создания
    );
  }

  // Получение списка желаемого по ID с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getWishlist(
    @Req() req: RequestUser, // Получение пользователя из запроса
    @Param('id') id: number, // ID списка желаемого
  ): Promise<Wishlist> {
    return await this.wishlistsService.getWishlist(req.user, id);
  }

  // Обновление списка желаемого по ID с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWishlist(
    @Req() req: RequestUser, // Получение пользователя из запроса
    @Param('id') id: number, // ID списка желаемого
    @Body() updateWishDto: UpdateWishDto, // DTO для обновления
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateWishlist(
      req.user, // Передача пользователя
      id, // ID списка
      updateWishDto, // Передача данных для обновления
    );
  }

  // Удаление списка желаемого по ID с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeWishlist(
    @Req() req: RequestUser, // Получение пользователя из запроса
    @Param('id') id: number, // ID удаляемого списка
  ): Promise<Wishlist> {
    return await this.wishlistsService.removeWishlist(req.user, id);
  }
}
