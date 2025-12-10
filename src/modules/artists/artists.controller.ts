import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ArtistsService, Artist } from './artists.service';
import { QueryArtistDto } from './dto/query-artist.dto';

@ApiTags('artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists with their tracks' })
  @ApiResponse({ status: 200, description: 'List of artists' })
  findAll(@Query() queryDto: QueryArtistDto) {
    return this.artistsService.findAll(queryDto);
  }

  @Get('names')
  @ApiOperation({ summary: 'Get list of all artist names' })
  @ApiResponse({ status: 200, description: 'List of artist names' })
  getArtistNames(): Promise<string[]> {
    return this.artistsService.getArtistNames();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get an artist by name with their tracks' })
  @ApiParam({ name: 'name', description: 'Artist name' })
  @ApiResponse({ status: 200, description: 'Artist found' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  findOne(@Param('name') name: string): Promise<Artist> {
    return this.artistsService.findOne(decodeURIComponent(name));
  }
}

