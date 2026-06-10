// quotes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote, QuoteStatus } from './quote.entity';
import { CreateQuoteDto } from './quote.dto';
import { MailService } from '../mail/mail.service';
import { CranesService } from '../cranes/cranes.service';

export { Quote, QuoteStatus };

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote) private readonly repo: Repository<Quote>,
    private readonly mail: MailService,
    private readonly cranes: CranesService,
  ) {}

  async create(dto: CreateQuoteDto) {
    let craneName: string | undefined;
    if (dto.craneId) {
      try {
        const crane = await this.cranes.findOne(dto.craneId);
        craneName = `${crane.brand} ${crane.model}`;
      } catch {}
    }
    const quote = this.repo.create(dto);
    const saved = await this.repo.save(quote);
    await this.mail.sendQuoteNotification({ ...dto, craneName });
    return saved;
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.repo.findAndCount({
      relations: ['crane'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateStatus(id: number, status: QuoteStatus) {
    await this.repo.update(id, { status });
    return this.repo.findOne({ where: { id }, relations: ['crane'] });
  }
}
