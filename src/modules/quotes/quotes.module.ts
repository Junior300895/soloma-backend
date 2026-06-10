import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './quote.entity';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { MailModule } from '../mail/mail.module';
import { CranesModule } from '../cranes/cranes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quote]), MailModule, CranesModule],
  providers: [QuotesService],
  controllers: [QuotesController],
})
export class QuotesModule {}
