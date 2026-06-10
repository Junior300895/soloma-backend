import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crane } from './crane.entity';
import { CranesService } from './cranes.service';
import { CranesController } from './cranes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Crane])],
  providers: [CranesService],
  controllers: [CranesController],
  exports: [CranesService],
})
export class CranesModule {}
