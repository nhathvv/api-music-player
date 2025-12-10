import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { QueryTrackDto } from './dto/query-track.dto';
import { Track } from './schemas/track.schema';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new track' })
  @ApiResponse({ status: 201, description: 'Track created successfully', type: Track })
  @ApiResponse({ status: 409, description: 'Track with this URL already exists' })
  create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.tracksService.create(createTrackDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple tracks' })
  @ApiResponse({ status: 201, description: 'Tracks created successfully' })
  createMany(@Body() createTrackDtos: CreateTrackDto[]): Promise<Track[]> {
    return this.tracksService.createMany(createTrackDtos);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracks with filters and pagination' })
  @ApiResponse({ status: 200, description: 'List of tracks' })
  findAll(@Query() queryDto: QueryTrackDto) {
    return this.tracksService.findAll(queryDto);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get all favorite tracks' })
  @ApiResponse({ status: 200, description: 'List of favorite tracks' })
  getFavorites(): Promise<Track[]> {
    return this.tracksService.getFavorites();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a track by ID' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Track found', type: Track })
  @ApiResponse({ status: 404, description: 'Track not found' })
  findOne(@Param('id') id: string): Promise<Track> {
    return this.tracksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a track' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Track updated', type: Track })
  @ApiResponse({ status: 404, description: 'Track not found' })
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto): Promise<Track> {
    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a track' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiResponse({ status: 204, description: 'Track deleted' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tracksService.remove(id);
  }

  @Patch(':id/favorite')
  @ApiOperation({ summary: 'Toggle favorite status of a track' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Favorite status toggled', type: Track })
  @ApiResponse({ status: 404, description: 'Track not found' })
  toggleFavorite(@Param('id') id: string): Promise<Track> {
    return this.tracksService.toggleFavorite(id);
  }

  @Patch(':id/playlist/:playlistName')
  @ApiOperation({ summary: 'Add track to a playlist' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiParam({ name: 'playlistName', description: 'Playlist name' })
  @ApiResponse({ status: 200, description: 'Track added to playlist', type: Track })
  addToPlaylist(@Param('id') id: string, @Param('playlistName') playlistName: string): Promise<Track> {
    return this.tracksService.addToPlaylist(id, playlistName);
  }

  @Delete(':id/playlist/:playlistName')
  @ApiOperation({ summary: 'Remove track from a playlist' })
  @ApiParam({ name: 'id', description: 'Track ID' })
  @ApiParam({ name: 'playlistName', description: 'Playlist name' })
  @ApiResponse({ status: 200, description: 'Track removed from playlist', type: Track })
  removeFromPlaylist(@Param('id') id: string, @Param('playlistName') playlistName: string): Promise<Track> {
    return this.tracksService.removeFromPlaylist(id, playlistName);
  }
}

