// contact.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'full_name', length: 150 }) fullName: string;
  @Column({ length: 255 }) email: string;
  @Column({ length: 30, nullable: true }) phone: string;
  @Column({ length: 300, nullable: true }) subject: string;
  @Column({ type: 'text' }) message: string;
  @Column({ name: 'is_read', default: false }) isRead: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
