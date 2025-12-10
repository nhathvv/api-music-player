import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { UserPlaylistsService } from './user-playlists.service';
import { UserPlaylistsController } from './user-playlists.controller';
import { Track, TrackSchema } from '../tracks/schemas/track.schema';
import { UserPlaylist, UserPlaylistSchema } from './schemas/user-playlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: UserPlaylist.name, schema: UserPlaylistSchema },
    ]),
  ],
  controllers: [PlaylistsController, UserPlaylistsController],
  providers: [PlaylistsService, UserPlaylistsService],
  exports: [PlaylistsService, UserPlaylistsService],
})
export class PlaylistsModule {}

