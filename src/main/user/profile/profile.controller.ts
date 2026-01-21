import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create.profile.dto';

@ApiBearerAuth()
@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
 
  @Post()
  @ApiOperation({ summary: 'Create a new user profile' })
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    const profile = await this.profileService.createProfile(createProfileDto);
    return {
      success: true,
      message: 'Profile created successfully',
      data: profile
    };
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Get profile by user ID' })
  async getProfileByUserId(@Param('userId') userId: string) {
    const profile = await this.profileService.getProfileByUserId(userId);
    return {
      success: true,
      data: profile
    };
  }
}