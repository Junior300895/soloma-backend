// quotes.controller.ts
import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QuotesService, QuoteStatus } from './quotes.service';
import { CreateQuoteDto } from './quote.dto';

@ApiTags('Devis')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly service: QuotesService) {}

  @Post()
  @ApiOperation({ summary: 'Soumettre une demande de devis' })
  create(@Body() dto: CreateQuoteDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Liste des devis (admin)' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findAll(+page, +limit);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Changer le statut d\'un devis' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: QuoteStatus) {
    return this.service.updateStatus(id, status);
  }
}
