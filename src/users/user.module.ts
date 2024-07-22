import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { OffersController } from './user.controller';

@Module({
  controllers: [OffersController],
  providers: [UsersService],
})
export class OffersModule {}
