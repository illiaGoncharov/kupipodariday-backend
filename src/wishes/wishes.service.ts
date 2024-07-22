import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>, // Внедрение репозитория
  ) {}

  // Создание нового желания с указанием владельца
  async createWish(id: number, createWishDto: CreateWishDto) {
    const wish = { ...createWishDto, owner: { id } };
    await this.wishRepository.save(wish);
  }

  // Поиск последних 40 желаний по дате создания
  async findLast() {
    const wishes: Wish[] = await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
    return wishes;
  }

  // Поиск топ-20 желаний по количеству копий
  async findTop() {
    const wishes: Wish[] = await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
    return wishes;
  }

  // Получение желания по ID с отношениями
  async getWish(id: number) {
    const wish: Wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });

    if (!wish) {
      throw new NotFoundException('Такого подарка нет');
    }

    const { offers, ...partialWish } = wish;

    // Преобразование предложений с именем пользователя
    const offerRes = offers.map((offer) => {
      const { user, ...rest } = offer;
      return { ...rest, user: user.username };
    });

    return { ...partialWish, offers: offerRes };
  }

  // Обновление желания с проверкой прав
  async updateWish(
    user: UserProfileResponseDto,
    id: number,
    updateWishDto: UpdateWishDto,
  ) {
    const { affected } = await this.wishRepository.update(
      { owner: { id: user.id }, id, raised: 0 },
      updateWishDto,
    );

    if (!affected) {
      throw new BadRequestException('Это не ваш подарок');
    }
  }

  // Удаление желания с проверкой прав
  async removeWish(user: UserProfileResponseDto, id: number) {
    const deletedWish = await this.wishRepository.findOne({
      where: { owner: { id: user.id }, id, raised: 0 },
    });

    if (!deletedWish) {
      throw new BadRequestException('Это не ваш подарок');
    }

    await this.wishRepository.delete({ owner: { id: user.id }, id });

    return deletedWish;
  }

  // Копирование желания и увеличение счётчика копий
  async copyWish(user: UserProfileResponseDto, WishId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, name, link, image, price, description, owner } =
      await this.wishRepository.findOne({
        where: { id: WishId },
        relations: { owner: true },
      });

    const createWishDto: CreateWishDto = {
      name,
      link,
      image,
      price,
      description,
    };

    await this.createWish(user.id, createWishDto); // Создание новой копии желания

    await this.wishRepository.increment({ id }, 'copied', 1); // Увеличение счётчика копий
  }
}
