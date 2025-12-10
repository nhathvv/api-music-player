import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTrackToPlaylistDto {
  @ApiProperty({ description: 'Track ID to add' })
  @IsString()
  trackId: string;
}

