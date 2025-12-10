import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateUserPlaylistDto {
  @ApiProperty({ description: 'Playlist name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Device ID for guest users', required: false })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiProperty({ description: 'Playlist description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Playlist artwork URL', required: false })
  @IsString()
  @IsOptional()
  artwork?: string;

  @ApiProperty({ description: 'Initial track IDs', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  trackIds?: string[];

  @ApiProperty({ description: 'Is public playlist', required: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

