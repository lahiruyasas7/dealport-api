import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PresignedUrlDto } from './dtos/presigned-url.dto';
import { UploadsService } from './upload.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presigned-url')
  getPresignedUrl(@Body() dto: PresignedUrlDto) {
    return this.uploadsService.createPresignedUploadUrl(
      dto.fileName,
      dto.fileType,
    );
  }
}
