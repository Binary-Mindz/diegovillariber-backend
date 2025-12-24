import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  ForgetPasswordDto,
  LoginDto,
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
  @ApiOperation({ summary: 'login' })
  forgetpassword(@Body() login: ForgetPasswordDto) {
    return this.authService.forgetPassword(login.email);
  }
}
