import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserPlaylist, UserPlaylistDocument } from './schemas/user-playlist.schema';
import { Track, TrackDocument } from '../tracks/schemas/track.schema';
import { CreateUserPlaylistDto } from './dto/create-user-playlist.dto';
import { UpdateUserPlaylistDto } from './dto/update-user-playlist.dto';

export interface PlaylistWithTracks {
  _id: string;
  name: string;
  description?: string;
  artwork?: string;
  isPublic: boolean;
  tracks: Track[];
  trackCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserPlaylistsService {
  constructor(
    @InjectModel(UserPlaylist.name) private playlistModel: Model<UserPlaylistDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  async create(dto: CreateUserPlaylistDto, userId?: string): Promise<PlaylistWithTracks> {
    const query: Record<string, unknown> = { name: dto.name };
    if (userId) {
      query.userId = new Types.ObjectId(userId);
    } else if (dto.deviceId) {
      query.deviceId = dto.deviceId;
    }

    const existing = await this.playlistModel.findOne(query);
    if (existing) {
      throw new ConflictException('Playlist with this name already exists');
    }

    const playlist = new this.playlistModel({
      ...dto,
      userId: userId ? new Types.ObjectId(userId) : undefined,
      trackIds: dto.trackIds?.map((id) => new Types.ObjectId(id)) || [],
    });

    const saved = await playlist.save();
    return this.findOne(saved._id.toString());
  }

  async findAll(userId?: string, deviceId?: string): Promise<PlaylistWithTracks[]> {
    const query: Record<string, unknown> = {};
    if (userId) {
      query.userId = new Types.ObjectId(userId);
    } else if (deviceId) {
      query.deviceId = deviceId;
    }

    const playlists = await this.playlistModel.find(query).sort({ createdAt: -1 }).exec();

    const result: PlaylistWithTracks[] = [];
    for (const playlist of playlists) {
      const tracks = await this.trackModel.find({ _id: { $in: playlist.trackIds } }).exec();
      result.push({
        _id: playlist._id.toString(),
        name: playlist.name,
        description: playlist.description,
        artwork: playlist.artwork || tracks[0]?.artwork,
        isPublic: playlist.isPublic,
        tracks,
        trackCount: tracks.length,
        createdAt: (playlist as any).createdAt,
        updatedAt: (playlist as any).updatedAt,
      });
    }

    return result;
  }

  async findOne(id: string): Promise<PlaylistWithTracks> {
    const playlist = await this.playlistModel.findById(id).exec();
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    const tracks = await this.trackModel.find({ _id: { $in: playlist.trackIds } }).exec();

    return {
      _id: playlist._id.toString(),
      name: playlist.name,
      description: playlist.description,
      artwork: playlist.artwork || tracks[0]?.artwork,
      isPublic: playlist.isPublic,
      tracks,
      trackCount: tracks.length,
      createdAt: (playlist as any).createdAt,
      updatedAt: (playlist as any).updatedAt,
    };
  }

  async update(id: string, dto: UpdateUserPlaylistDto): Promise<UserPlaylist> {
    const playlist = await this.playlistModel.findByIdAndUpdate(
      id,
      { ...dto, trackIds: dto.trackIds?.map((tid) => new Types.ObjectId(tid)) },
      { new: true },
    ).exec();

    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }

    return playlist;
  }

  async remove(id: string): Promise<void> {
    const result = await this.playlistModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
  }

  async addTrack(playlistId: string, trackId: string): Promise<PlaylistWithTracks> {
    const playlist = await this.playlistModel.findById(playlistId).exec();
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found`);
    }

    const track = await this.trackModel.findById(trackId).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }

    const trackObjectId = new Types.ObjectId(trackId);
    if (!playlist.trackIds.some((id) => id.equals(trackObjectId))) {
      playlist.trackIds.push(trackObjectId);
      await playlist.save();
    }

    return this.findOne(playlistId);
  }

  async removeTrack(playlistId: string, trackId: string): Promise<PlaylistWithTracks> {
    const playlist = await this.playlistModel.findById(playlistId).exec();
    if (!playlist) {
      throw new NotFoundException(`Playlist with ID ${playlistId} not found`);
    }

    const trackObjectId = new Types.ObjectId(trackId);
    playlist.trackIds = playlist.trackIds.filter((id) => !id.equals(trackObjectId));
    await playlist.save();

    return this.findOne(playlistId);
  }
}

