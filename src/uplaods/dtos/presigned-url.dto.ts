import { IsIn, IsString, MaxLength } from 'class-validator';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export class PresignedUrlDto {
  @IsString()
  @MaxLength(255)
  fileName: string;

  @IsIn(ALLOWED_MIME_TYPES, {
    message: `fileType must be one of: ${ALLOWED_MIME_TYPES.join(', ')}`,
  })
  fileType: string;
}
