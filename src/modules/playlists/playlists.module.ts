import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { Track, TrackSchema } from '../tracks/schemas/track.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}

