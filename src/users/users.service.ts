import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';

import { User } from './entities/user.entity';

import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, // Внедрение репозитория
    @InjectRepository(Wish) private wishRepository: Repository<Wish>, // Внедрение репозитория
  ) {}

  // Метод для создания нового пользователя
  async createUser(createUserDto: CreateUserDto) {
    const isUser = await this.userRepository.findBy([
      { username: createUserDto.username },
      { email: createUserDto.email },
    ]);

    // Если пользователь уже существует, выбрасываем исключение
    if (isUser.length > 0)
      throw new ConflictException(
        'Пользователь с таким именем и email уже зарегистрирован',
      );

    // Хеширование пароля пользователя перед сохранением
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    // Создание нового пользователя с хешированным паролем
    const userDto = {
      ...createUserDto,
      password: hashPassword,
    };

    // Сохранение нового пользователя в БД
    const user = await this.userRepository.save(userDto);
    return user;
  }

  // Метод для поиска пользователя по имени
  async findUserByName(username: string): Promise<CreateUserDto> {
    // Поиск пользователя с указанным именем и выбор полей email и password
    const user: CreateUserDto = await this.userRepository
      .createQueryBuilder('user')
      .where({ username })
      .addSelect(['user.email', 'user.password'])
      .getOne();
    return user;
  }

  // Метод для поиска пользователя по ID
  async findUserById(id: number) {
    const user: UserProfileResponseDto = await this.userRepository.findOneBy({
      id,
    });
    return user;
  }

  // Метод для обновления данных пользователя
  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    // Проверка на существование пользователя с тем же именем или email, исключая текущего пользователя
    const users = await this.userRepository.findBy([
      { username: updateUserDto.username },
      { email: updateUserDto.email },
    ]);

    for (const user of users) {
      if (user.id !== id) {
        throw new ConflictException('Такой пользователь уже зарегистрирован');
      }
    }

    // Хеширование нового пароля, если он был предоставлен
    if (Object.hasOwn(updateUserDto, 'password')) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Обновление данных пользователя
    await this.userRepository.update(id, updateUserDto);

    // Возвращение обновленного пользователя с полем email
    const user: UserProfileResponseDto = await this.userRepository
      .createQueryBuilder('user')
      .where({ id })
      .addSelect('user.email')
      .getOne();
    return user;
  }

  // Метод для поиска всех желаний пользователя по его ID
  async findOneUserWishes(id: number) {
    const wishes: Wish[] = await this.wishRepository.findBy({
      owner: { id },
    });
    return wishes;
  }

  // Метод для получения пользователя по имени пользователя
  async getUser(username: string) {
    const user: UserPublicProfileResponseDto =
      await this.userRepository.findOneBy({ username });
    return user;
  }

  // Метод для получения всех желаний пользователя по имени пользователя
  async getUserWishes(username: string) {
    const user: UserPublicProfileResponseDto =
      await this.userRepository.findOneBy({ username });
    const wishes: Wish[] = await this.wishRepository.findBy({
      owner: { id: user.id },
    });
    return wishes;
  }

  // Метод для поиска пользователей по строковому запросу
  async findMany(query: string) {
    // Поиск пользователей по имени или email, содержащим строку запроса
    const users: UserPublicProfileResponseDto[] =
      await this.userRepository.findBy([
        { username: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
      ]);
    return users;
  }
}
