import { Controller, Get, Post, Delete, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PlaylistsService, Playlist } from './playlists.service';
import { QueryPlaylistDto } from './dto/query-playlist.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Track } from '../tracks/schemas/track.schema';

@ApiTags('playlists')
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all playlists with their tracks' })
  @ApiResponse({ status: 200, description: 'List of playlists' })
  findAll(@Query() queryDto: QueryPlaylistDto) {
    return this.playlistsService.findAll(queryDto);
  }

  @Get('names')
  @ApiOperation({ summary: 'Get list of all playlist names' })
  @ApiResponse({ status: 200, description: 'List of playlist names' })
  getPlaylistNames(): Promise<string[]> {
    return this.playlistsService.getPlaylistNames();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a playlist by name with its tracks' })
  @ApiParam({ name: 'name', description: 'Playlist name' })
  @ApiResponse({ status: 200, description: 'Playlist found' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  findOne(@Param('name') name: string): Promise<Playlist> {
    return this.playlistsService.findOne(decodeURIComponent(name));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new playlist' })
  @ApiBody({ type: CreatePlaylistDto })
  @ApiResponse({ status: 201, description: 'Playlist created successfully' })
  create(@Body() createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    return this.playlistsService.createPlaylist(createPlaylistDto.name, createPlaylistDto.trackIds || []);
  }

  @Delete(':name')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a playlist' })
  @ApiParam({ name: 'name', description: 'Playlist name' })
  @ApiResponse({ status: 204, description: 'Playlist deleted' })
  @ApiResponse({ status: 404, description: 'Playlist not found' })
  remove(@Param('name') name: string): Promise<void> {
    return this.playlistsService.deletePlaylist(decodeURIComponent(name));
  }

  @Post(':name/tracks/:trackId')
  @ApiOperation({ summary: 'Add a track to a playlist' })
  @ApiParam({ name: 'name', description: 'Playlist name' })
  @ApiParam({ name: 'trackId', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Track added to playlist' })
  addTrackToPlaylist(@Param('name') name: string, @Param('trackId') trackId: string): Promise<Track> {
    return this.playlistsService.addTrackToPlaylist(decodeURIComponent(name), trackId);
  }

  @Delete(':name/tracks/:trackId')
  @ApiOperation({ summary: 'Remove a track from a playlist' })
  @ApiParam({ name: 'name', description: 'Playlist name' })
  @ApiParam({ name: 'trackId', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Track removed from playlist' })
  removeTrackFromPlaylist(@Param('name') name: string, @Param('trackId') trackId: string): Promise<Track> {
    return this.playlistsService.removeTrackFromPlaylist(decodeURIComponent(name), trackId);
  }
}

