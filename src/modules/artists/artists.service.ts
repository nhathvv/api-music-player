import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Track, TrackDocument } from '../tracks/schemas/track.schema';
import { QueryArtistDto } from './dto/query-artist.dto';

export interface Artist {
  name: string;
  tracks: Track[];
  trackCount: number;
  artworkPreview?: string;
}

@Injectable()
export class ArtistsService {
  constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>) {}

  async findAll(queryDto: QueryArtistDto): Promise<{ data: Artist[]; total: number; page: number; limit: number }> {
    const { search, page = 1, limit = 20 } = queryDto;

    const matchStage: Record<string, unknown> = { artist: { $exists: true, $nin: [null, ''] } };
    if (search) {
      matchStage.artist = { $regex: search, $options: 'i' };
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $group: {
          _id: '$artist',
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
      { $match: matchStage },
      { $group: { _id: '$artist' } },
      { $count: 'total' },
    ];

    const [artists, countResult] = await Promise.all([
      this.trackModel.aggregate([...pipeline, { $skip: (page - 1) * limit }, { $limit: limit }]),
      this.trackModel.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;

    return { data: artists, total, page, limit };
  }

  async findOne(name: string): Promise<Artist> {
    const tracks = await this.trackModel.find({ artist: name }).exec();
    if (tracks.length === 0) {
      throw new NotFoundException(`Artist "${name}" not found`);
    }

    return {
      name,
      tracks,
      trackCount: tracks.length,
      artworkPreview: tracks[0]?.artwork,
    };
  }

  async getArtistNames(): Promise<string[]> {
    const artists = await this.trackModel.distinct('artist').exec();
    return artists.filter((artist) => artist != null && artist !== '');
  }
}

