import { Module } from '@nestjs/common';
import { AmbassadorProgramController } from './ambassador-program.controller';
import { AmbassadorProgramService } from './ambassador-program.service';

@Module({
  controllers: [AmbassadorProgramController],
  providers: [AmbassadorProgramService],
})
export class AmbassadorProgramModule {}
