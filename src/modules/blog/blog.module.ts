// blog.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, PostCategory } from './post.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostCategory])],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
