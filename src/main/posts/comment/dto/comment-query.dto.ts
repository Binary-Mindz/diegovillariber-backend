import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CommentsQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number (starts from 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page (max 50)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'new',
    description: 'Sort order: new | old',
  })
  @IsOptional()
  @IsString()
  sort?: 'new' | 'old' = 'new';

  @ApiPropertyOptional({
    example: true,
    description: 'Include replies under each comment',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeReplies?: boolean = true;

  @ApiPropertyOptional({
    example: '9f1c3d21-91e4-4f2c-9c22-ec2cbb9f8a55',
    description: 'Filter replies of a specific parent comment (optional)',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
