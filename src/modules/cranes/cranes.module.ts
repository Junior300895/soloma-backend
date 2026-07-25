import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crane } from './crane.entity';
import { CranesService } from './cranes.service';
import { CranesController } from './cranes.controller';
import { UploadModule } from '@/modules/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Crane]), UploadModule],
  providers: [CranesService],
  controllers: [CranesController],
  exports: [CranesService],
})
export class CranesModule {}
