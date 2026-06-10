// blog.controller.ts
import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BlogService } from './blog.service';

@ApiTags('Blog')
@Controller('posts')
export class BlogController {
  constructor(private readonly service: BlogService) {}
  @Get() findAll(@Query('page') p = 1, @Query('limit') l = 9, @Query('categoryId') cat?: number) { return this.service.findAll(+p, +l, cat ? +cat : undefined); }
  @Get('categories') getCategories() { return this.service.getCategories(); }
  @Get(':slug') findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.service.update(id, dto); }
  @Patch(':id/publish') publish(@Param('id', ParseIntPipe) id: number) { return this.service.publish(id); }
}
