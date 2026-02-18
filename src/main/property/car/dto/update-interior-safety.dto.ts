import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateInteriorSafetyDto {
  @ApiPropertyOptional({
    example: 'Recaro Sportster CS',
    description: 'Seat model',
  })
  @IsOptional()
  @IsString()
  seats?: string;

  @ApiPropertyOptional({
    example: '6-Point Racing Harness',
    description: 'Harness system',
  })
  @IsOptional()
  @IsString()
  harness?: string;
}
