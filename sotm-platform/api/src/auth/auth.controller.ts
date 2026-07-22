import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PasswordResetDto } from '../dto/password-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req: any) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validateToken(@Request() req: any) {
    return {
      isValid: true,
      user: {
        _id: req.user._id,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        isSuperAdmin: req.user.isSuperAdmin,
      },
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.resetPassword(passwordResetDto);
  }
}
