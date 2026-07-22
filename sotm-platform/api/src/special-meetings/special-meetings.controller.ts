import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SpecialMeetingsService } from './special-meetings.service';

@Controller('special-meetings')
export class SpecialMeetingsController {
  constructor(
    private readonly specialMeetingsService: SpecialMeetingsService,
  ) {}

  // Public: read-only list, usable by the website.
  @Get()
  findAll() {
    return this.specialMeetingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async syncSpecialMeetings() {
    await this.specialMeetingsService.syncSpecialMeetingCollection();
    return { message: 'Special meetings collection synced successfully.' };
  }
}
