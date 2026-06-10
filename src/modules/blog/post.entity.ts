// post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('post_categories')
export class PostCategory {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 100 }) name: string;
  @Column({ length: 100, unique: true }) slug: string;
}

export enum PostStatus { DRAFT = 'draft', PUBLISHED = 'published', ARCHIVED = 'archived' }

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'category_id', nullable: true }) categoryId: number;
  @ManyToOne(() => PostCategory, { nullable: true, onDelete: 'SET NULL' }) @JoinColumn({ name: 'category_id' }) category: PostCategory;
  @Column({ length: 300, unique: true }) slug: string;
  @Column({ length: 300 }) title: string;
  @Column({ type: 'text', nullable: true }) excerpt: string;
  @Column({ type: 'longtext', nullable: true }) content: string;
  @Column({ name: 'cover_image', nullable: true }) coverImage: string;
  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT }) status: PostStatus;
  @Column({ name: 'published_at', nullable: true }) publishedAt: Date;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
