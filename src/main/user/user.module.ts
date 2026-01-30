import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { FollowModule } from './folllow/follow.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [ProfileModule, FollowModule, ReportModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserModule {}
