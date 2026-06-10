import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email, isActive: true } });
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      access_token: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email déjà utilisé');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({ email: dto.email, name: dto.name, passwordHash });
    const saved = await this.userRepo.save(user);
    return { id: saved.id, email: saved.email, name: saved.name };
  }

  async me(userId: number) {
    return this.userRepo.findOne({ where: { id: userId }, select: ['id', 'email', 'name', 'role', 'createdAt'] });
  }
}
