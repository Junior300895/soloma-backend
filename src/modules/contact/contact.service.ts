// contact.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact) private readonly repo: Repository<Contact>,
    private readonly mail: MailService,
  ) {}

  async create(dto: CreateContactDto) {
    const contact = await this.repo.save(this.repo.create(dto));
    await this.mail.sendContactNotification(dto);
    return contact;
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async markRead(id: number) {
    await this.repo.update(id, { isRead: true });
    return this.repo.findOne({ where: { id } });
  }
}
