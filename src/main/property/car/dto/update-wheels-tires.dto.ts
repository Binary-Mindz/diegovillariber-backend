import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateWheelsTiresDto {
  @ApiPropertyOptional({
    example: -2.5,
    description: 'Front wheel alignment camber',
  })
  @IsOptional()
  @IsNumber()
  wheelAlignmentFront?: number;

  @ApiPropertyOptional({
    example: -1.8,
    description: 'Rear wheel alignment camber',
  })
  @IsOptional()
  @IsNumber()
  wheelAlignmentRear?: number;

  @ApiPropertyOptional({
    example: 0.05,
    description: 'Front toe angle',
  })
  @IsOptional()
  @IsNumber()
  frontToe?: number;

  @ApiPropertyOptional({
    example: 0.03,
    description: 'Rear toe angle',
  })
  @IsOptional()
  @IsNumber()
  rearToe?: number;

  @ApiPropertyOptional({
    example: 6.5,
    description: 'Front caster angle',
  })
  @IsOptional()
  @IsNumber()
  frontCaster?: number;

  @ApiPropertyOptional({
    example: 'Optimized for track stability',
    description: 'Alignment notes',
  })
  @IsOptional()
  @IsString()
  alignmentNotes?: string;
}
