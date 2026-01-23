import { BadRequestException } from '@nestjs/common';
import { CreateProfileDto } from '../dto/create.profile.dto';

export function assertPayloadMatchesType(dto: Pick<
  CreateProfileDto,
  'profileType' | 'spotter' | 'owner' | 'creator' | 'business' | 'proDriver' | 'simRacing'
>) {
  const map = {
    SPOTTER: !!dto.spotter,
    OWNER: !!dto.owner,
    CONTENT_CREATOR: !!dto.creator,
    PRO_BUSSINESS: !!dto.business,  
    PRO_DRIVER: !!dto.proDriver,
    SIM_RACING_DRIVER: !!dto.simRacing,   
  } as const;

  const key = String(dto.profileType) as keyof typeof map;

  const anyProvided =
    dto.spotter ||
    dto.owner ||
    dto.creator ||
    dto.business ||
    dto.proDriver ||
    dto.simRacing;

  if (!(key in map)) {
    throw new BadRequestException(
      `Invalid profileType: ${dto.profileType}. Allowed: ${Object.keys(map).join(', ')}`,
    );
  }

  // if any payload provided, must match type
  if (anyProvided && !map[key]) {
    throw new BadRequestException(
      `Payload does not match profileType: ${dto.profileType}`,
    );
  }
}
