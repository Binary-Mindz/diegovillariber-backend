import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { FollowModule } from './folllow/follow.module';



@Module({
    imports:[ProfileModule, FollowModule],
  controllers: [],
  providers: [],
  exports: []
})
export class UserModule {}