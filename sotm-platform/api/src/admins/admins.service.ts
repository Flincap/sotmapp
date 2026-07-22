import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Admin } from '../schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AdminDto } from '../dto/admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async findOne(email: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) throw new NotFoundException('Admin not found!');
    return admin;
  }

  async findAll(): Promise<any> {
    return this.adminModel.find().select('-password').exec();
  }

  async createAdmin(adminDto: AdminDto): Promise<Admin> {
    try {
      const existingAdmin = await this.adminModel.findOne({
        email: adminDto.email,
      });

      if (existingAdmin) {
        throw new BadRequestException('Admin with this email already exists.');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminDto.password, salt);
      adminDto.password = hashedPassword;

      const createdAdmin = await this.adminModel.create(adminDto);

      const adminObject = createdAdmin.toObject();
      const { password, ...results } = adminObject;
      return results as unknown as Admin;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to create admin');
    }
  }

  async deleteAdmin(id: string): Promise<Admin> {
    const deletedAdmin = await this.adminModel.findByIdAndDelete(id);
    if (!deletedAdmin) throw new NotFoundException('Admin not found!');

    return deletedAdmin;
  }
}
