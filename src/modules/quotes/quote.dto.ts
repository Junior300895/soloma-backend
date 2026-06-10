// quote.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from './quote.entity';

export class CreateQuoteDto {
  @ApiPropertyOptional() @IsOptional() @IsNumber() craneId?: number;
  @ApiProperty() @IsString() fullName: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() company?: string;
  @ApiPropertyOptional({ enum: ServiceType }) @IsOptional() @IsEnum(ServiceType) serviceType?: ServiceType;
  @ApiPropertyOptional() @IsOptional() @IsString() message?: string;
}
