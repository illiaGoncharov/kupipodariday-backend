import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

import { Wishlist } from './entities/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
