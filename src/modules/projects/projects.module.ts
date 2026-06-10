import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, ProjectMedia } from './project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectMedia])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
