import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProfileShareService } from './profile-share.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';

@Controller('profile-share')
export class ProfileShareController {
  constructor(private readonly profileShareService: ProfileShareService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':profileId')
  async getMyProfileShareQr(@GetUser('userId') userId: string, @Param('profileId') profileId: string) {
    return this.profileShareService.getOrCreateShareData(userId, profileId);
  }

  @Get('public/:slug')
  async getPublicProfile(@Param('slug') slug: string) {
    return this.profileShareService.getPublicProfileBySlug(slug);
  }

  @Post(':profileId/increment')
  async incrementShare(@Param('profileId') profileId: string) {
    await this.profileShareService.increaseShareCount(profileId);
    return {
      message: 'Share count updated successfully',
    };
  }
}