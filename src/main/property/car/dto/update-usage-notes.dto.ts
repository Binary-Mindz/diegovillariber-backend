import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUsageNotesDto {
  @ApiPropertyOptional({
    example: 'Track',
    description: 'Primary usage category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'Advanced Driver',
    description: 'Driver skill level',
  })
  @IsOptional()
  @IsString()
  driverLevel?: string;

  @ApiPropertyOptional({
    example: 'Time Attack',
    description: 'Driving usage mode',
  })
  @IsOptional()
  @IsString()
  usageMode?: string;

  @ApiPropertyOptional({
    example: 'Front camber -2.5°, Rear camber -1.8°',
    description: 'Wheel alignment notes',
  })
  @IsOptional()
  @IsString()
  alignmentNotes?: string;
}
