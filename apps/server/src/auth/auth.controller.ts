import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestCodeDto, VerifyCodeDto } from '../auth/dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-code')
  async requestCode(@Body() dto: RequestCodeDto) {
    return this.authService.requestCode(dto.email);
  }

  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto.email, dto.code);
  }
}
