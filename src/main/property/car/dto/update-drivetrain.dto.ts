import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateDrivetrainDto {
  @ApiPropertyOptional({
    example: 'Sequential 6-Speed',
    description: 'Transmission setup details',
  })
  @IsOptional()
  @IsString()
  transmission?: string;

  @ApiPropertyOptional({
    example: 'Limited Slip Differential',
    description: 'Differential configuration',
  })
  @IsOptional()
  @IsString()
  differential?: string;

  @ApiPropertyOptional({
    example: 'Twin Plate Clutch',
    description: 'Clutch system',
  })
  @IsOptional()
  @IsString()
  clutch?: string;
}
