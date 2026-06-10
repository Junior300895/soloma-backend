import { IsString, IsNumber, IsEnum, IsOptional, IsUrl, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CraneStatus } from './crane.entity';

export class CreateCraneDto {
  @ApiProperty() @IsString() model: string;
  @ApiProperty() @IsString() brand: string;
  @ApiProperty() @IsNumber() @Min(1) capacityT: number;
  @ApiProperty() @IsNumber() @Min(1) maxHeightM: number;
  @ApiProperty() @IsNumber() @Min(1) maxRadiusM: number;
  @ApiPropertyOptional({ enum: CraneStatus })
  @IsOptional() @IsEnum(CraneStatus) status?: CraneStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() imageUrl?: string;
}

export class UpdateCraneDto extends PartialType(CreateCraneDto) {}

export class CraneFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: CraneStatus })
  @IsOptional() @IsEnum(CraneStatus) status?: CraneStatus;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() capacityMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() capacityMax?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() brand?: string;
}
