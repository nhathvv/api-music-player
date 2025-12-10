import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPlaylistDto {
  @ApiProperty({ description: 'Search by playlist name', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 20 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 20;
}

