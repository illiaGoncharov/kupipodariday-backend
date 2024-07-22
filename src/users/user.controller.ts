import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly UsersService: UsersService) {}

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.UsersService.create(CreateUserDto);
  }

  @Get()
  findAll() {
    return this.UsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.UsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.UsersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.UsersService.remove(+id);
  }
}
