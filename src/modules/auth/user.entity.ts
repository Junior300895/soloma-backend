import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole { ADMIN = 'admin', EDITOR = 'editor' }

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 100, unique: true }) email: string;
  @Column({ name: 'password_hash' }) passwordHash: string;
  @Column({ length: 100 }) name: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN }) role: UserRole;
  @Column({ name: 'is_active', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
