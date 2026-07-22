import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema, Admin } from '../schemas/admin.schema';
import { AdminsController } from './admins.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  providers: [AdminsService],
  exports: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}
