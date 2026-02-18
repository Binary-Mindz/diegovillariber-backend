import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateChassisBrakesDto {
  @ApiPropertyOptional({
    example: 'KW V4 Coilovers',
    description: 'Suspension system',
  })
  @IsOptional()
  @IsString()
  suspension?: string;

  @ApiPropertyOptional({
    example: 'Brembo GT Kit',
    description: 'Brake system details',
  })
  @IsOptional()
  @IsString()
  brakes?: string;

  @ApiPropertyOptional({
    example: 'FIA Certified Roll Cage',
    description: 'Roll cage information',
  })
  @IsOptional()
  @IsString()
  rollCage?: string;
}
