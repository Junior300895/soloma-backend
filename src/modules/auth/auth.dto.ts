import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@soloma.sn' })
  @IsEmail() email: string;

  @ApiProperty({ example: 'motdepasse' })
  @IsString() @MinLength(6) password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty() @IsString() name: string;
}
