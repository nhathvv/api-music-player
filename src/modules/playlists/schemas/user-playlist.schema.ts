import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserPlaylistDocument = UserPlaylist & Document;

@Schema({ timestamps: true })
export class UserPlaylist {
  @ApiProperty({ description: 'Playlist name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'User ID who owns this playlist' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @ApiProperty({ description: 'Device ID for guest users' })
  @Prop()
  deviceId?: string;

  @ApiProperty({ description: 'Playlist description' })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Playlist artwork URL' })
  @Prop()
  artwork?: string;

  @ApiProperty({ description: 'Array of track IDs in this playlist' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Track' }], default: [] })
  trackIds: Types.ObjectId[];

  @ApiProperty({ description: 'Is this a public playlist' })
  @Prop({ default: false })
  isPublic: boolean;
}

export const UserPlaylistSchema = SchemaFactory.createForClass(UserPlaylist);

UserPlaylistSchema.index({ userId: 1 });
UserPlaylistSchema.index({ deviceId: 1 });
UserPlaylistSchema.index({ name: 1, userId: 1 }, { unique: true, sparse: true });
UserPlaylistSchema.index({ name: 1, deviceId: 1 }, { unique: true, sparse: true });

