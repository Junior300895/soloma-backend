// blog.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Blog')
@Controller('posts')
export class BlogController {
  constructor(private readonly service: BlogService) {}
  @Get() findAll(@Query('page') p = 1, @Query('limit') l = 9, @Query('categoryId') cat?: number) { return this.service.findAll(+p, +l, cat ? +cat : undefined); }
  @Get('categories') getCategories() { return this.service.getCategories(); }
  @Get('by-id/:id') @UseGuards(JwtAuthGuard) @ApiBearerAuth() findById(@Param('id', ParseIntPipe) id: number) { return this.service.findById(id); }
  @Get(':slug') findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.service.update(id, dto); }
  @Patch(':id/publish') publish(@Param('id', ParseIntPipe) id: number) { return this.service.publish(id); }
  @Delete(':id') @UseGuards(JwtAuthGuard) @ApiBearerAuth() @ApiOperation({ summary: 'Supprimer un article' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
