import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { Track, TrackSchema } from '../tracks/schemas/track.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }])],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}

