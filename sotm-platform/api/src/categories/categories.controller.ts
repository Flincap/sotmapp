import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NameDto } from '../dto/name.dto';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() nameDto: NameDto) {
    return this.categoriesService.create(nameDto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async syncCategories() {
    await this.categoriesService.syncCategoriesCollection();
    return { message: 'Categories collection synced successfully.' };
  }
}