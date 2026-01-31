import { Module } from '@nestjs/common';
import { OfficialPartnerController } from './official-pertner.controller';
import { OfficialPartnerService } from './official-pertner.service';


@Module({
  controllers: [OfficialPartnerController],
  providers: [OfficialPartnerService],
})
export class OfficialPartnerModule {}
