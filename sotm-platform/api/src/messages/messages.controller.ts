import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import cloudinary from '../cloudinary.provider';
import { memoryStorage } from 'multer';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
dotenv.config();

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/admin/all')
  findAllAdmin(@Query() query: Record<string, any>) {
    return this.messagesService.findAllAdmin(query);
  }

  @Get('/featured')
  findFeatured() {
    return this.messagesService.findFeatured();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle-featured')
  toggleFeatured(@Param('id') id: string) {
    return this.messagesService.toggleFeatured(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/stats')
  getStats() {
    return this.messagesService.getStats();
  }

  @Get()
  findAll(@Query() query: Record<string, any>) {
    const page = parseInt(query.page, 10) || 1;
    const limit = 8;

    const sortField = query.sortField || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const filters = { ...query };
    delete filters.page;
    delete filters.limit;
    delete filters.sortField;
    delete filters.sortOrder;

    return this.messagesService.findAll(
      filters,
      { page, limit },
      { field: sortField, order: sortOrder as 'asc' | 'desc' },
    );
  }

  // Public: the website's message detail pages fetch by id.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      if (file) {
        // const uploadResult = await cloudinary.uploader.upload(file.path, {
        //   folder: 'messages',
        // });
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'messages',
          },
        );
        createMessageDto.imageUrl = uploadResult.secure_url;
      }

      // const fs = await import('fs/promises');
      // await fs.unlink(file.path);

      return this.messagesService.create(createMessageDto);
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    try {
      if (file) {
        // const uploadResult = await cloudinary.uploader.upload(file.path, {
        //   folder: 'messages',
        // });
        const uploadResult = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'messages',
          },
        );
        updateMessageDto.imageUrl = uploadResult.secure_url;

        // const fs = await import('fs/promises');
        // await fs.unlink(file.path);
      }
      return this.messagesService.update(id, updateMessageDto);
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.messagesService.delete(id);
  }
}
