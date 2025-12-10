import { PartialType } from '@nestjs/swagger';
import { CreateUserPlaylistDto } from './create-user-playlist.dto';

export class UpdateUserPlaylistDto extends PartialType(CreateUserPlaylistDto) {}

