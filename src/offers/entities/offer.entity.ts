import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { IsBoolean, IsPositive } from 'class-validator';

import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity() // Указывает, что класс является сущностью базы
export class Offer {
  @PrimaryGeneratedColumn() // Первичный ключ с автоинкрементом
  id: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  @IsPositive() // Валидатор, проверяющий, что значение положительное
  amount: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean() // Валидатор, проверяющий, что значение является булевым
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers) // Связь многие-к-одному с сущностью User
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers) // Связь многие-к-одному с сущностью Wish
  item: Wish;
}
