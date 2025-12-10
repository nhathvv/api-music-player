import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'User email address' })
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @ApiProperty({ description: 'User display name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'User avatar URL', required: false })
  @Prop()
  avatar?: string;

  @ApiProperty({ description: 'Array of favorite track IDs' })
  @Prop({ type: [String], default: [] })
  favoriteTrackIds: string[];

  @ApiProperty({ description: 'User playlists' })
  @Prop({ type: [{ name: String, trackIds: [String] }], default: [] })
  playlists: { name: string; trackIds: string[] }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });

