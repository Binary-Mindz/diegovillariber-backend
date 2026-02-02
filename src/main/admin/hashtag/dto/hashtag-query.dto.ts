import { IsOptional, IsString } from 'class-validator';

export class HashtagQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
