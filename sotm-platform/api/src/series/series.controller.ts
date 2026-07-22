import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  // Public: read-only list, usable by the website.
  @Get()
  async findAll() {
    return this.seriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async syncSeries() {
    await this.seriesService.syncSeriesCollection();
    return { message: 'Series collection synced successfully.' };
  }
}
