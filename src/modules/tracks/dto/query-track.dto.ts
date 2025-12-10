import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTrackDto {
  @ApiProperty({ description: 'Search term for title or artist', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Filter by artist name', required: false })
  @IsString()
  @IsOptional()
  artist?: string;

  @ApiProperty({ description: 'Filter by playlist name', required: false })
  @IsString()
  @IsOptional()
  playlist?: string;

  @ApiProperty({ description: 'Filter by rating (0 or 1)', required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rating?: number;

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

