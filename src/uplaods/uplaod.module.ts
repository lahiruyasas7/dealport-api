import { Module } from '@nestjs/common';
import { UploadsController } from './upload.controller';
import { UploadsService } from './upload.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
