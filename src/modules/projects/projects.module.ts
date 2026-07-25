import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, ProjectMedia } from './project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UploadModule } from '@/modules/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMedia]), UploadModule],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
