import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from './entities/wishlist.entity';

import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
  ) {}

  // Получение всех списков желаемого пользователя
  async findWishlists(user: UserProfileResponseDto) {
    return await this.wishlistRepository.findBy({ owner: { id: user.id } });
  }

  // Создание нового списка желаемого
  async createWishlist(
    user: UserProfileResponseDto,
    createWishlistDto: CreateWishlistDto,
  ) {
    const { name, image, itemsId } = createWishlistDto;
    const wishes = await this.wishRepository.findBy({ id: In(itemsId) });
    return await this.wishlistRepository.save({
      name,
      image,
      owner: user,
      items: wishes,
    });
  }

  // Получение списка желаемого по ID с проверкой владельца
  async getWishlist(user: UserProfileResponseDto, id: number) {
    return await this.wishlistRepository.findOne({
      where: { id, owner: { id: user.id } },
      relations: { owner: true, items: true },
    });
  }

  // Обновление списка желаемого по ID
  async updateWishlist(
    user: UserProfileResponseDto, // Пользователь, обновляющий список
    id: number, // ID списка
    updateWishlistDto: UpdateWishlistDto, // DTO для обновления
  ) {
    const { itemsId, ...wishlist } = updateWishlistDto;
    // Если предоставлены ID элементов
    if (!itemsId) {
      const wishes = await this.wishRepository.findBy({
        id: In(updateWishlistDto.itemsId),
      });
      wishlist['items'] = wishes;
    }
    const { affected } = await this.wishlistRepository.update(
      { id, owner: { id: user.id } }, // Условие обновления
      wishlist, // Обновляемые данные
    );
    if (!affected) {
      throw new BadRequestException('Данного листа нет');
    }
    return await this.wishlistRepository.findOneBy({ id });
  }

  // Удаление списка желаемого по ID
  async removeWishlist(user: UserProfileResponseDto, id: number) {
    const wishlist = await this.getWishlist(user, id);
    if (!wishlist) {
      throw new BadRequestException('Данного листа нет');
    }
    await this.wishlistRepository.delete({
      owner: { id: user.id }, // Условие удаления
      id, // ID удаляемого списка
    });
    return wishlist;
  }
}
