import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createOfferDto: CreateOfferDto) {
    return 'This action adds a new offer';
  }

  findAll() {
    return `This action returns all offers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
