import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TrackDocument = Track & Document;

@Schema({ timestamps: true })
export class Track {
  @ApiProperty({ description: 'URL of the audio file' })
  @Prop({ required: true, unique: true })
  url: string;

  @ApiProperty({ description: 'Title of the track' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Artist name', required: false })
  @Prop()
  artist?: string;

  @ApiProperty({ description: 'URL of the artwork image', required: false })
  @Prop()
  artwork?: string;

  @ApiProperty({ description: 'Rating (0 or 1 for favorite)', required: false, default: 0 })
  @Prop({ default: 0 })
  rating: number;

  @ApiProperty({ description: 'List of playlist names this track belongs to', required: false })
  @Prop({ type: [String], default: [] })
  playlist: string[];

  @ApiProperty({ description: 'Duration of the track in seconds', required: false })
  @Prop()
  duration?: number;

  @ApiProperty({ description: 'Genre of the track', required: false })
  @Prop()
  genre?: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);

TrackSchema.index({ title: 'text', artist: 'text' });
TrackSchema.index({ artist: 1 });
TrackSchema.index({ rating: 1 });
TrackSchema.index({ playlist: 1 });

