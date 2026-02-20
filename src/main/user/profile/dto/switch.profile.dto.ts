import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

// switch-profile.dto.ts
export class SwitchProfileDto {
  @ApiProperty({
    example: 'profileId',
    description: 'Profile Id',
  })
  @IsString()
  profileId: string;
}