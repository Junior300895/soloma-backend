// projects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectMedia, MediaType } from './project.entity';
import { UploadService } from '@/modules/upload/upload.module';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
    @InjectRepository(ProjectMedia) private readonly mediaRepo: Repository<ProjectMedia>,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(page = 1, limit = 12) {
    const [data, total] = await this.repo.findAndCount({
      relations: ['media'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id }, relations: ['media'] });
    if (!p) throw new NotFoundException(`Projet #${id} introuvable`);
    return p;
  }

  async create(dto: Partial<Project>) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: Partial<Project>) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    // Supprimer coverImage + tous les médias photo de Cloudinary
    const urls = [
      project.coverImage,
      ...project.media.filter(m => m.type === MediaType.PHOTO).map(m => m.url),
    ].filter(Boolean);
    await Promise.all(urls.map(url => this.uploadService.deleteFile(url).catch(() => null)));
    await this.repo.delete(id);
    return { message: `Projet #${id} supprimé` };
  }

  async addMedia(projectId: number, dto: { type: MediaType; url: string; caption?: string; sortOrder?: number }) {
    await this.findOne(projectId);
    return this.mediaRepo.save(this.mediaRepo.create({ ...dto, projectId }));
  }

  async removeMedia(projectId: number, mediaId: number) {
    const media = await this.mediaRepo.findOne({ where: { id: mediaId, projectId } });
    if (media?.url && media.type === MediaType.PHOTO) {
      await this.uploadService.deleteFile(media.url).catch(() => null);
    }
    await this.mediaRepo.delete({ id: mediaId, projectId });
    return { message: 'Média supprimé' };
  }
}
