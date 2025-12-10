import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserPlaylistsService, PlaylistWithTracks } from './user-playlists.service';
import { CreateUserPlaylistDto } from './dto/create-user-playlist.dto';
import { UpdateUserPlaylistDto } from './dto/update-user-playlist.dto';
import { AddTrackToPlaylistDto } from './dto/add-track-to-playlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('user-playlists')
@Controller('user-playlists')
export class UserPlaylistsController {
  constructor(private readonly playlistsService: UserPlaylistsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new user playlist' })
  @ApiResponse({ status: 201, description: 'Playlist created successfully' })
  @ApiResponse({ status: 409, description: 'Playlist with this name already exists' })
  create(
    @Body() createDto: CreateUserPlaylistDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.playlistsService.create(createDto, userId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all user playlists' })
  @ApiQuery({ name: 'deviceId', required: false, description: 'Device ID for guest users' })
  @ApiResponse({ status: 200, description: 'List of user playlists' })
  findAll(
    @Query('deviceId') deviceId?: string,
    @Request() req?: any,
  ): Promise<PlaylistWithTracks[]> {
    const userId = req?.user?.id;
    return this.playlistsService.findAll(userId, deviceId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a playlist by ID' })
  @ApiParam({ name: 'id', description: 'Playlist ID' })
  @ApiResponse({ status: 200, description: 'Playlist found' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  findOne(@Param('id') id: string): Promise<PlaylistWithTracks> {
    return this.playlistsService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update a playlist' })
  @ApiParam({ name: 'id', description: 'Playlist ID' })
  @ApiResponse({ status: 200, description: 'Playlist updated' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateUserPlaylistDto) {
    return this.playlistsService.update(id, updateDto);
  }

  @Delete(':id')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a playlist' })
  @ApiParam({ name: 'id', description: 'Playlist ID' })
  @ApiResponse({ status: 204, description: 'Playlist deleted' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.playlistsService.remove(id);
  }

  @Post(':id/tracks')
  @Public()
  @ApiOperation({ summary: 'Add a track to playlist' })
  @ApiParam({ name: 'id', description: 'Playlist ID' })
  @ApiResponse({ status: 200, description: 'Track added to playlist' })
  @ApiResponse({ status: 404, description: 'Playlist or track not found' })
  addTrack(
    @Param('id') id: string,
    @Body() dto: AddTrackToPlaylistDto,
  ): Promise<PlaylistWithTracks> {
    return this.playlistsService.addTrack(id, dto.trackId);
  }

  @Delete(':id/tracks/:trackId')
  @Public()
  @ApiOperation({ summary: 'Remove a track from playlist' })
  @ApiParam({ name: 'id', description: 'Playlist ID' })
  @ApiParam({ name: 'trackId', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Track removed from playlist' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  removeTrack(
    @Param('id') id: string,
    @Param('trackId') trackId: string,
  ): Promise<PlaylistWithTracks> {
    return this.playlistsService.removeTrack(id, trackId);
  }
}

