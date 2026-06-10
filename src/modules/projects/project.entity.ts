import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, OneToMany, ManyToOne, JoinColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 300 }) title: string;
  @Column({ length: 200, nullable: true }) location: string;
  @Column({ length: 200, nullable: true }) client: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'text', nullable: true }) results: string;
  @Column({ name: 'cover_image', nullable: true }) coverImage: string;
  @Column({ name: 'completed_at', type: 'date', nullable: true }) completedAt: string;
  @OneToMany(() => ProjectMedia, (m) => m.project, { cascade: true }) media: ProjectMedia[];
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

export enum MediaType { PHOTO = 'photo', VIDEO = 'video' }

@Entity('project_media')
export class ProjectMedia {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'project_id' }) projectId: number;
  @ManyToOne(() => Project, (p) => p.media, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'project_id' }) project: Project;
  @Column({ type: 'enum', enum: MediaType }) type: MediaType;
  @Column({ length: 500 }) url: string;
  @Column({ length: 300, nullable: true }) caption: string;
  @Column({ name: 'sort_order', default: 0 }) sortOrder: number;
}
