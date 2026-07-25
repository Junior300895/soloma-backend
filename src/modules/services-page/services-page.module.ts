import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { Injectable, NotFoundException, Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UploadModule, UploadService } from '@/modules/upload/upload.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Injectable()
class ServicesPageService {
  constructor(
    @InjectRepository(Service) private readonly repo: Repository<Service>,
    private readonly uploadService: UploadService,
  ) {}
  findAll(all = false) {
    return this.repo.find({ where: all ? {} : { isActive: true }, order: { sortOrder: 'ASC' } });
  }
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
  async remove(id: number) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Service introuvable');
    if (s.imageUrl) await this.uploadService.deleteFile(s.imageUrl).catch(() => null);
    await this.repo.delete(id);
    return { message: `Service #${id} supprimé` };
  }
}

@ApiTags('Services')
@Controller('services')
class ServicesPageController {
  constructor(private readonly service: ServicesPageService) {}
  @Get() @ApiOperation({ summary: 'Liste des services (all=true pour inclure les inactifs)' })
  findAll(@Query('all') all?: string) { return this.service.findAll(all === 'true'); }
  @Get(':slug') findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.service.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard) @ApiBearerAuth() @ApiOperation({ summary: 'Supprimer un service' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}

@Module({
  imports: [TypeOrmModule.forFeature([Service]), UploadModule],
  providers: [ServicesPageService],
  controllers: [ServicesPageController],
})
export class ServicesPageModule {}
