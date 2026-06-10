import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Connexion admin — retourne un JWT' })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Créer un compte admin (première installation)' })
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil de l\'utilisateur connecté' })
  me(@Request() req: any) {
    return this.service.me(req.user.id);
  }
}
