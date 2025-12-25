import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  ForgetPasswordDto,
  LoginDto,
  Otp,
  ResetPasswordDto,
} from './dto/create-auth.dto';
import { ApiOperation } from '@nestjs/swagger';
import { handleRequest } from '@/common/helpers/handle.request';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user account' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return handleRequest(
      () => this.authService.createUser(createAuthDto),
      'User created successfully',
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'login' })
  login(@Body() login: LoginDto) {
    return this.authService.loginuser(login);
  }

  @Post('forgetpassword')
  @ApiOperation({ summary: 'Forget Password' })
  forgetpassword(@Body() login: ForgetPasswordDto) {
    return this.authService.forgetPassword(login.email);
  }

  @Post('verify-forgot-otp')
  @ApiOperation({ summary: 'verify otp' })
  verifyForgotOtp(@Body() otp: Otp) {
    return this.authService.verifyForgotOtp(otp.otp);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password without OTP or ID' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return handleRequest(
      () => this.authService.resetPassword(dto.password),
      'Password Set successful',
    );
  }
}
