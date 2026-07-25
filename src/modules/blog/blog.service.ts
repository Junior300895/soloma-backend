// blog.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus, PostCategory } from './post.entity';
import { UploadService } from '@/modules/upload/upload.module';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
    @InjectRepository(PostCategory) private readonly catRepo: Repository<PostCategory>,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(page = 1, limit = 9, categoryId?: number) {
    const qb = this.repo.createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .where('post.status = :status', { status: PostStatus.PUBLISHED });
    if (categoryId) qb.andWhere('post.categoryId = :categoryId', { categoryId });
    qb.orderBy('post.publishedAt', 'DESC');
    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: number) {
    const post = await this.repo.findOne({ where: { id }, relations: ['category'] });
    if (!post) throw new NotFoundException('Article introuvable');
    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.repo.findOne({ where: { slug, status: PostStatus.PUBLISHED }, relations: ['category'] });
    if (!post) throw new NotFoundException('Article introuvable');
    return post;
  }

  async getCategories() { return this.catRepo.find(); }

  async create(dto: Partial<Post>) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: Partial<Post>) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }

  async publish(id: number) {
    await this.repo.update(id, { status: PostStatus.PUBLISHED, publishedAt: new Date() });
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Article introuvable');
    if (post.coverImage) {
      await this.uploadService.deleteFile(post.coverImage).catch(() => null);
    }
    await this.repo.delete(id);
    return { message: `Article #${id} supprimé` };
  }
}
