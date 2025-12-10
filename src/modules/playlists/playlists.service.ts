import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Track, TrackDocument } from '../tracks/schemas/track.schema';
import { QueryPlaylistDto } from './dto/query-playlist.dto';

export interface Playlist {
  name: string;
  tracks: Track[];
  trackCount: number;
  artworkPreview?: string;
}

@Injectable()
export class PlaylistsService {
  constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>) {}

  async findAll(queryDto: QueryPlaylistDto): Promise<{ data: Playlist[]; total: number; page: number; limit: number }> {
    const { search, page = 1, limit = 20 } = queryDto;

    const matchStage: Record<string, unknown> = { playlist: { $exists: true, $ne: [] } };

    const basePipeline: PipelineStage[] = [
      { $match: matchStage },
      { $unwind: '$playlist' },
    ];

    if (search) {
      basePipeline.push({ $match: { playlist: { $regex: search, $options: 'i' } } });
    }

    const pipeline: PipelineStage[] = [
      ...basePipeline,
      {
        $group: {
          _id: '$playlist',
          tracks: { $push: '$$ROOT' },
          trackCount: { $sum: 1 },
          artworkPreview: { $first: '$artwork' },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          tracks: 1,
          trackCount: 1,
          artworkPreview: 1,
        },
      },
      { $sort: { name: 1 as const } },
    ];

    const countPipeline: PipelineStage[] = [
      ...basePipeline,
      { $group: { _id: '$playlist' } },
      { $count: 'total' },
    ];

    const [playlists, countResult] = await Promise.all([
      this.trackModel.aggregate([...pipeline, { $skip: (page - 1) * limit }, { $limit: limit }]),
      this.trackModel.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    return { data: playlists, total, page, limit };
  }

  async findOne(name: string): Promise<Playlist> {
    const tracks = await this.trackModel.find({ playlist: name }).exec();
    if (tracks.length === 0) {
      throw new NotFoundException(`Playlist "${name}" not found`);
    }

    return {
      name,
      tracks,
      trackCount: tracks.length,
      artworkPreview: tracks[0]?.artwork,
    };
  }

  async getPlaylistNames(): Promise<string[]> {
    const playlists = await this.trackModel.distinct('playlist').exec();
    return playlists.filter((playlist) => playlist != null && playlist !== '');
  }

  async addTrackToPlaylist(playlistName: string, trackId: string): Promise<Track> {
    const track = await this.trackModel.findById(trackId).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }

    if (!track.playlist.includes(playlistName)) {
      track.playlist.push(playlistName);
      await track.save();
    }

    return track;
  }

  async removeTrackFromPlaylist(playlistName: string, trackId: string): Promise<Track> {
    const track = await this.trackModel.findById(trackId).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }

    track.playlist = track.playlist.filter((p) => p !== playlistName);
    await track.save();

    return track;
  }

  async createPlaylist(name: string, trackIds: string[]): Promise<Playlist> {
    await this.trackModel.updateMany(
      { _id: { $in: trackIds } },
      { $addToSet: { playlist: name } },
    );

    return this.findOne(name);
  }

  async deletePlaylist(name: string): Promise<void> {
    const result = await this.trackModel.updateMany(
      { playlist: name },
      { $pull: { playlist: name } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException(`Playlist "${name}" not found`);
    }
  }
}

