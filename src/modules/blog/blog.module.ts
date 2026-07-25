// blog.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, PostCategory } from './post.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { UploadModule } from '@/modules/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory]), UploadModule],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
