import {
  Body,
  Get,
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminDto } from '../dto/admin.dto';
import { AdminsService } from './admins.service';
import { SuperAdminGuard } from '../auth/super-admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Get()
  async findAll() {
    return this.adminsService.findAll();
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Post('create')
  async createAdmin(@Body() adminDto: AdminDto) {
    return this.adminsService.createAdmin(adminDto);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Delete(':id')
  async deleteAdmin(@Param('id') id: string) {
    return this.adminsService.deleteAdmin(id);
  }
}
