// service.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('services')
export class Service {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 100, unique: true }) slug: string;
  @Column({ length: 200 }) title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ length: 50, nullable: true }) icon: string;
  @Column({ name: 'image_url', nullable: true }) imageUrl: string;
  @Column({ name: 'is_active', default: true }) isActive: boolean;
  @Column({ name: 'sort_order', default: 0 }) sortOrder: number;
}
