import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SpeakersService } from './speakers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('speakers')
export class SpeakersController {
  constructor(private readonly speakersService: SpeakersService) {}

  // Public: powers the "Minister" filter on the website.
  @Get()
  findAll() {
    return this.speakersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async syncSpeakers() {
    await this.speakersService.syncSpeakersCollection();
    return { message: 'Speakers collection synced successfully.' };
  }
}
