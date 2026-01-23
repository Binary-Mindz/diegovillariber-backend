import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create.profile.dto';
import { JwtAuthGuard } from '@/main/auth/guards/jwt-auth.guard';

import { GetUser } from '@/main/auth/decorator/get-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
 
  @Post()
  @ApiOperation({ summary: 'Create a new user profile. Type: SPOTTER,OWNER,CONTENT_CREATOR, PRO_BUSSINESS, PRO_DRIVER , SIM_RACING_DRIVER'})
  async createProfile(@GetUser('id') userId:string,@Body() dto: CreateProfileDto) {
    const profile = await this.profileService.createProfile(userId, dto);
    return {
      success: true,
      message: 'Profile created successfully',
      data: profile
    };
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Get profile by user ID' })
  async getProfileByUserId(@GetUser('id') userId: string) {
    const profile = await this.profileService.getProfilesByUserId(userId);
    return {
      success: true,
      data: profile
    };
  }
}