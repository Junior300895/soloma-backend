// contact.controller.ts
import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}
  @Post() @ApiOperation({ summary: 'Envoyer un message de contact' })
  create(@Body() dto: CreateContactDto) { return this.service.create(dto); }
  @Get() @ApiOperation({ summary: 'Liste des messages (admin)' })
  findAll(@Query('page') p = 1, @Query('limit') l = 20) { return this.service.findAll(+p, +l); }
  @Patch(':id/read') @ApiOperation({ summary: 'Marquer comme lu' })
  markRead(@Param('id', ParseIntPipe) id: number) { return this.service.markRead(id); }
}
