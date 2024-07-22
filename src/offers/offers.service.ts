import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Offer } from './entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>, // Внедрение репозитория предложений
    @InjectRepository(Wish) private wishRepository: Repository<Wish>, // Внедрение репозитория желаний
  ) {}

  async createOffer(
    user: UserProfileResponseDto, // Пользователь, создающий предложение
    createOfferDto: CreateOfferDto, // DTO для создания предложения
  ) {
    const { amount, hidden, itemId } = createOfferDto;
    const wish = await this.wishRepository.findOne({
      where: { id: itemId }, // Поиск желания по ID
      relations: { owner: true }, // Загрузка владельца желания
    });

    if (wish.owner.id === user.id) {
      throw new BadRequestException('Сделать невозможно'); // Проверка, не является ли пользователь владельцем желания
    }

    if (wish.price - wish.raised < createOfferDto.amount) {
      throw new BadRequestException('Слишком большая сумма'); // Проверка на превышение суммы предложения
    }

    await this.offerRepository.save({
      amount,
      hidden,
      item: wish, // Привязка предложения к желанию
      user, // Привязка предложения к пользователю
    });

    await this.wishRepository.increment({ id: wish.id }, 'raised', amount);
  }

  // Получение всех видимых предложений
  async findOffers() {
    return await this.offerRepository.find({ where: { hidden: false } });
  }

  // Получение предложения по ID
  async getOffer(id: number) {
    return await this.offerRepository.findOneBy({ id });
  }
}
