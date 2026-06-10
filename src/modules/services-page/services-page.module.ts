import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { Injectable, NotFoundException, Controller, Get, Post, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Injectable()
class ServicesPageService {
  constructor(@InjectRepository(Service) private readonly repo: Repository<Service>) {}
  findAll() { return this.repo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } }); }
  async findBySlug(slug: string) {
    const s = await this.repo.findOne({ where: { slug } });
    if (!s) throw new NotFoundException('Service introuvable');
    return s;
  }
  create(dto: Partial<Service>) { return this.repo.save(this.repo.create(dto)); }
  async update(id: number, dto: Partial<Service>) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }
}

@ApiTags('Services')
@Controller('services')
class ServicesPageController {
  constructor(private readonly service: ServicesPageService) {}
  @Get() @ApiOperation({ summary: 'Liste des services actifs' }) findAll() { return this.service.findAll(); }
  @Get(':slug') findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.service.update(id, dto); }
}

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  providers: [ServicesPageService],
  controllers: [ServicesPageController],
})
export class ServicesPageModule {}
