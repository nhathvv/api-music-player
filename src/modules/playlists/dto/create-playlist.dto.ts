import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePlaylistDto {
  @ApiProperty({ description: 'Name of the playlist' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the playlist', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Artwork URL for the playlist', required: false })
  @IsString()
  @IsOptional()
  artwork?: string;

  @ApiProperty({ description: 'Array of track IDs to add to playlist', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  trackIds?: string[];
}

