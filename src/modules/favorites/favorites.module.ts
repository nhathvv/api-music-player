import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Track, TrackSchema } from '../tracks/schemas/track.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}

