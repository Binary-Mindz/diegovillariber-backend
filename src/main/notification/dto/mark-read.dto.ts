import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MarkReadParamDto {
  @ApiProperty({ example: 'notification-id' })
  @IsUUID()
  id: string;
}