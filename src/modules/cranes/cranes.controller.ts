import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CranesService } from './cranes.service';
import { CreateCraneDto, UpdateCraneDto, CraneFilterDto } from './crane.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Grues')
@Controller('cranes')
export class CranesController {
  constructor(private readonly service: CranesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des grues avec filtres et pagination' })
  findAll(@Query() filters: CraneFilterDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une grue' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Créer une grue' })
  @ApiBearerAuth()
  create(@Body() dto: CreateCraneDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Modifier une grue' })
  @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCraneDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Supprimer une grue' })
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
