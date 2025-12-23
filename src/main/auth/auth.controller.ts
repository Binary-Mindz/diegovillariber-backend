import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
 
  @Post('signup')
  @ApiOperation({ summary: 'Create a new user account' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post('login')
  @ApiOperation({summary: 'login'})
  login(@Body()  login: LoginDto) {
    return this.authService.loginuser(login);
  }
  
   @Post('forgetpassword')
    @ApiOperation({summary: 'login'})
    forgetpassword(@Body()  login: LoginDto) {
      return this.authService.forgetpassword(login);
    }

}
