import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crane } from './crane.entity';
import { CreateCraneDto, UpdateCraneDto, CraneFilterDto } from './crane.dto';

@Injectable()
export class CranesService {
  constructor(
    @InjectRepository(Crane)
    private readonly repo: Repository<Crane>,
  ) {}

  async findAll(filters: CraneFilterDto) {
    const { page = 1, limit = 12, status, capacityMin, capacityMax, brand } = filters;
    const qb = this.repo.createQueryBuilder('crane');

    if (status) qb.andWhere('crane.status = :status', { status });
    if (capacityMin) qb.andWhere('crane.capacityT >= :min', { min: capacityMin });
    if (capacityMax) qb.andWhere('crane.capacityT <= :max', { max: capacityMax });
    if (brand) qb.andWhere('crane.brand LIKE :brand', { brand: `%${brand}%` });

    qb.orderBy('crane.createdAt', 'DESC');

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const crane = await this.repo.findOne({ where: { id } });
    if (!crane) throw new NotFoundException(`Grue #${id} introuvable`);
    return crane;
  }

  async create(dto: CreateCraneDto) {
    const crane = this.repo.create(dto);
    return this.repo.save(crane);
  }

  async update(id: number, dto: UpdateCraneDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Grue #${id} supprimée` };
  }
}
