// projects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectMedia, MediaType } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
    @InjectRepository(ProjectMedia) private readonly mediaRepo: Repository<ProjectMedia>,
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
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Projet #${id} supprimé` };
  }

  async addMedia(projectId: number, dto: { type: MediaType; url: string; caption?: string; sortOrder?: number }) {
    await this.findOne(projectId);
    return this.mediaRepo.save(this.mediaRepo.create({ ...dto, projectId }));
  }

  async removeMedia(projectId: number, mediaId: number) {
    await this.mediaRepo.delete({ id: mediaId, projectId });
    return { message: 'Média supprimé' };
  }
}
