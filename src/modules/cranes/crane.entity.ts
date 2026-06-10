import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum CraneStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
}

@Entity('cranes')
export class Crane {
  @ApiProperty() @PrimaryGeneratedColumn() id: number;
  @ApiProperty() @Column({ length: 100 }) model: string;
  @ApiProperty() @Column({ length: 100 }) brand: string;
  @ApiProperty() @Column({ name: 'capacity_t' }) capacityT: number;
  @ApiProperty() @Column({ name: 'max_height_m' }) maxHeightM: number;
  @ApiProperty() @Column({ name: 'max_radius_m' }) maxRadiusM: number;
  @ApiProperty({ enum: CraneStatus })
  @Column({ type: 'enum', enum: CraneStatus, default: CraneStatus.AVAILABLE })
  status: CraneStatus;
  @ApiProperty({ required: false }) @Column({ type: 'text', nullable: true }) description: string;
  @ApiProperty({ required: false }) @Column({ name: 'image_url', nullable: true }) imageUrl: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
