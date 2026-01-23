import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create.profile.dto';
import { JwtAuthGuard } from '@/main/auth/guards/jwt-auth.guard';

import { GetUser } from '@/main/auth/decorator/get-user.decorator';
import { UpdateProfileBaseDto } from './dto/update.profile.dto';
import { ChangeProfileTypeDto } from './dto/changed.profile.type.dto';

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
    @Get(':profileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single profile by profileId' })
  @ApiParam({ name: 'profileId', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfileById(@Param('profileId') profileId: string) {
    const profile = await this.profileService.getProfileById(profileId);
    return {
      success: true,
      data: profile,
    };
  }

  @Patch(':profileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Update base fields (userName, bio, imageUrl, instagramHandler, accountType). Does NOT change profileType.',
  })
  @ApiParam({ name: 'profileId', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfileBase(
    @Param('profileId') profileId: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateProfileBaseDto,
  ) {
    const profile = await this.profileService.updateProfileBase(
      profileId,
      userId,
      dto,
    );
    return {
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    };
  }

  @Patch(':profileId/type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Change profileType and upsert the related sub-profile. For SIM_RACING_DRIVER it upserts nested sim entities.',
  })
  @ApiParam({ name: 'profileId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Profile type changed successfully',
  })
  async changeProfileType(
    @Param('profileId') profileId: string,
    @GetUser('id') userId: string,
    @Body() dto: ChangeProfileTypeDto,
  ) {
    const profile = await this.profileService.changeProfileType(
      profileId,
      userId,
      dto,
    );
    return {
      success: true,
      message: 'Profile type changed successfully',
      data: profile,
    };
  }
}