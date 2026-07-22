import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../schemas/admin.schema';
import * as bcrypt from 'bcrypt';
import { AdminsService } from '../admins/admins.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetDto } from '../dto/password-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<Admin> {
    try {
      const admin = await this.adminsService.findOne(email);

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        throw new UnauthorizedException('Incorrect password');
      }

      return admin;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Email not registered');
      }

      throw error;
    }
  }

  async signIn(admin: any) {
    const payload = { email: admin.email, sub: admin._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async resetPassword(passwordResetDto: PasswordResetDto): Promise<any> {
    const { email, currentPassword, newPassword } = passwordResetDto;

    const admin = await this.validateAdmin(email, currentPassword);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.adminModel.findByIdAndUpdate(admin._id, {
      password: hashedPassword,
    });

    return { message: 'Password updated successfully' };
  }
}
