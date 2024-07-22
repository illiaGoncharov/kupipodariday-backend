import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OffersModule } from './offers/offers.module';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';

@Module({
  imports: [
    UsersModule,
    OffersModule,
    WishesModule,
    WishlistsModule,

    // Настройка подключения к базе данных PostgreSQL с использованием TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'nest_project',
      entities: ['dist/*/entities/*.entity.js'], // Здесь можно указать сущности (entities) для TypeORM
      synchronize: true, // Автоматически синхронизировать схему базы данных с сущностями
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
