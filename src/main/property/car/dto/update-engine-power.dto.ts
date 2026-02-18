import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateEnginePowerDto {
  @ApiPropertyOptional({
    example: 'Michelin Pilot Sport 4S',
    description: 'Installed tire brand/model',
  })
  @IsOptional()
  @IsString()
  tires?: string;

  @ApiPropertyOptional({
    example: 'BBS FI-R',
    description: 'Wheel brand/model',
  })
  @IsOptional()
  @IsString()
  wheels?: string;
}
