import { Body, Controller, Post, UseGuards, Req, Get, HttpCode, HttpStatus, Param, Res, Delete, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SignUpDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { Roles } from '@/common/decorator/roles.tdecorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { Response } from 'express';
import { VerifyLoginOtpDto } from './dto/verify-login-otp.dto';
import { ResendLoginOtpDto } from './dto/resend-login-otp.dto';
import { ToggleTwoFactorDto } from './dto/toggle-two-factor.dto';
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.auth.signup(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.email, dto.otp);
  }

 @Post('login')
 @HttpCode(HttpStatus.OK)
async login(
  @Body() dto: LoginDto,
  @Res({ passthrough: true }) res: Response,
) {
  const response = await handleRequest(
    async () => {
      return await this.auth.login(dto.email, dto.password, dto.loginAs);
    },
    'Login successful',
    HttpStatus.OK,
  );

  res.status(response.statusCode); // now works
  return response;
}

 // NEW: verify login OTP
  @Post('verify-login-otp')
  @HttpCode(HttpStatus.OK)
  async verifyLoginOtp(
    @Body() dto: VerifyLoginOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => {
        return await this.auth.verifyLoginOtp(dto.tempToken, dto.otp);
      },
      'Login verified successfully',
      HttpStatus.OK,
    );

    res.status(response.statusCode);
    return response;
  }

  // NEW: resend login OTP
  @Post('resend-login-otp')
  @HttpCode(HttpStatus.OK)
  async resendLoginOtp(@Body() dto: ResendLoginOtpDto) {
    return this.auth.resendLoginOtp(dto.tempToken);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refreshTokens(dto.userId, dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: any) {
    return this.auth.logout(req.user.userId);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @GetUser('userId') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.auth.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

    // NEW: toggle two factor
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('two-factor')
  toggleTwoFactor(
    @GetUser('userId') userId: string,
    @Body() dto: ToggleTwoFactorDto,
  ) {
    return this.auth.toggleTwoFactor(userId, dto.enabled);
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by userId' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  async getUserById(@Param('id') id: string) {
    const user = await this.auth.getUserById(id);
    return {
      success: true,
      data: user,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getMe')
  getMe(@GetUser('userId') userId: string) {
    return this.auth.getMe(userId);
  }

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Delete('delete-me')
@ApiOperation({ summary: 'Delete my account' })
deleteMe(@GetUser('userId') userId: string) {
  return this.auth.deleteMe(userId);
}

  // Example: admin only route
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin-only')
  adminOnly() {
    return { ok: true };
  }
}
