import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request as IRequest } from 'express';

import { OffersService } from './offers.service';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// Интерфейс для расширения запроса с пользователем
interface RequestUser extends IRequest {
  user: UserProfileResponseDto;
}

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {} // Внедрение сервиса

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOffer(
    @Req() req: RequestUser, // Получение пользователя из запроса
    @Body() createOfferDto: CreateOfferDto, // DTO для создания предложения
  ): Promise<Record<string, never>> {
    await this.offersService.createOffer(req.user, createOfferDto); // Создание предложения
    return {};
  }

  @Get()
  async findOffers(): Promise<Offer[]> {
    return await this.offersService.findOffers(); // Возвращает список предложений
  }

  // Получение предложения по ID с проверкой авторизации
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOffer(@Param('id') id: number): Promise<Offer> {
    return await this.offersService.getOffer(id); // Возвращает предложение по ID
  }
}
