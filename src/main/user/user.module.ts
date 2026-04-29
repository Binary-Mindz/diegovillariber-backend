import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { FollowModule } from './folllow/follow.module';
import { ReportModule } from './report/report.module';
import { UserBlockModule } from './user-block/user-block.module';
import { UserPointModule } from './user-point/user-point.module';
import { ProfileShareModule } from './profile-share/profile-share.module';

@Module({
  imports: [ProfileModule, ProfileShareModule, FollowModule, ReportModule, UserBlockModule, UserPointModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserModule {}
