import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsUrl, Min, Max } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ description: 'URL of the audio file' })
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty({ description: 'Title of the track' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Artist name', required: false })
  @IsString()
  @IsOptional()
  artist?: string;

  @ApiProperty({ description: 'URL of the artwork image', required: false })
  @IsString()
  @IsOptional()
  artwork?: string;

  @ApiProperty({ description: 'Rating (0 or 1)', required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  rating?: number;

  @ApiProperty({ description: 'List of playlist names', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  playlist?: string[];

  @ApiProperty({ description: 'Duration in seconds', required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: 'Genre of the track', required: false })
  @IsString()
  @IsOptional()
  genre?: string;
}

