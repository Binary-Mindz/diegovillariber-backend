import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateTuningAeroDto {
  @ApiPropertyOptional({
    example: 'Stage 2 Custom ECU',
    description: 'ECU tuning details',
  })
  @IsOptional()
  @IsString()
  ecuType?: string;

  @ApiPropertyOptional({
    example: 'Carbon Front Splitter & Rear Wing',
    description: 'Aerodynamic parts',
  })
  @IsOptional()
  @IsString()
  aeroParts?: string;
}
