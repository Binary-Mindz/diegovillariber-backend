export class ProfileShareResponseDto {
  profileId!: string;
  profileName!: string | null;
  imageUrl!: string | null;
  shareUrl!: string;
  qrCodeDataUrl!: string;
}