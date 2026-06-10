import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Crane } from '../cranes/crane.entity';

export enum QuoteStatus { PENDING = 'pending', PROCESSED = 'processed', ARCHIVED = 'archived' }
export enum ServiceType { MANUTENTION = 'manutention', LEVAGE = 'levage', LOGISTIQUE = 'logistique', AUTRE = 'autre' }

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'crane_id', nullable: true }) craneId: number;
  @ManyToOne(() => Crane, { nullable: true, onDelete: 'SET NULL' }) @JoinColumn({ name: 'crane_id' }) crane: Crane;
  @Column({ name: 'full_name', length: 150 }) fullName: string;
  @Column({ length: 255 }) email: string;
  @Column({ length: 30, nullable: true }) phone: string;
  @Column({ length: 200, nullable: true }) company: string;
  @Column({ name: 'service_type', type: 'enum', enum: ServiceType, default: ServiceType.LEVAGE }) serviceType: ServiceType;
  @Column({ type: 'text', nullable: true }) message: string;
  @Column({ type: 'enum', enum: QuoteStatus, default: QuoteStatus.PENDING }) status: QuoteStatus;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
