import { Controller, Get, Post, Delete, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { Track } from '../tracks/schemas/track.schema';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorite tracks' })
  @ApiResponse({ status: 200, description: 'List of favorite tracks' })
  findAll(): Promise<Track[]> {
    return this.favoritesService.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Get count of favorite tracks' })
  @ApiResponse({ status: 200, description: 'Count of favorites' })
  getCount(): Promise<number> {
    return this.favoritesService.getFavoriteCount();
  }

  @Get(':trackId/status')
  @ApiOperation({ summary: 'Check if a track is favorite' })
  @ApiParam({ name: 'trackId', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Favorite status' })
  isFavorite(@Param('trackId') trackId: string): Promise<boolean> {
    return this.favoritesService.isFavorite(trackId);
  }

  @Patch(':trackId/toggle')
  @ApiOperation({ summary: 'Toggle favorite status of a track' })
  @ApiParam({ name: 'trackId', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Track favorite status toggled' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  toggleFavorite(@Param('trackId') trackId: string): Promise<Track> {
    return this.favoritesService.toggleFavorite(trackId);
  }

  @Post(':trackId')
  @ApiOperation({ summary: 'Add a track to favorites' })
  @ApiParam({ name: 'trackId', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Track added to favorites' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  addFavorite(@Param('trackId') trackId: string): Promise<Track> {
    return this.favoritesService.addFavorite(trackId);
  }

  @Delete(':trackId')
  @ApiOperation({ summary: 'Remove a track from favorites' })
  @ApiParam({ name: 'trackId', description: 'Track ID' })
  @ApiResponse({ status: 200, description: 'Track removed from favorites' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  removeFavorite(@Param('trackId') trackId: string): Promise<Track> {
    return this.favoritesService.removeFavorite(trackId);
  }
}

