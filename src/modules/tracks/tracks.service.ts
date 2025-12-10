import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { QueryTrackDto } from './dto/query-track.dto';

@Injectable()
export class TracksService {
  constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const existingTrack = await this.trackModel.findOne({ url: createTrackDto.url });
    if (existingTrack) {
      throw new ConflictException('Track with this URL already exists');
    }
    const track = new this.trackModel(createTrackDto);
    return track.save();
  }

  async createMany(createTrackDtos: CreateTrackDto[]): Promise<Track[]> {
    const tracks = await this.trackModel.insertMany(createTrackDtos, { ordered: false });
    return tracks;
  }

  async findAll(queryDto: QueryTrackDto): Promise<{ data: Track[]; total: number; page: number; limit: number }> {
    const { search, artist, playlist, rating, page = 1, limit = 20 } = queryDto;
    const filter: FilterQuery<TrackDocument> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
      ];
    }

    if (artist) {
      filter.artist = { $regex: artist, $options: 'i' };
    }

    if (playlist) {
      filter.playlist = playlist;
    }

    if (rating !== undefined) {
      filter.rating = rating;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.trackModel.find(filter).skip(skip).limit(limit).exec(),
      this.trackModel.countDocuments(filter),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.trackModel.findById(id).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  async findByUrl(url: string): Promise<Track> {
    const track = await this.trackModel.findOne({ url }).exec();
    if (!track) {
      throw new NotFoundException(`Track with URL ${url} not found`);
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.trackModel.findByIdAndUpdate(id, updateTrackDto, { new: true }).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  async remove(id: string): Promise<void> {
    const result = await this.trackModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
  }

  async toggleFavorite(id: string): Promise<Track> {
    const track = await this.trackModel.findById(id).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    track.rating = track.rating === 1 ? 0 : 1;
    return track.save();
  }

  async addToPlaylist(id: string, playlistName: string): Promise<Track> {
    const track = await this.trackModel.findById(id).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    if (!track.playlist.includes(playlistName)) {
      track.playlist.push(playlistName);
    }
    return track.save();
  }

  async removeFromPlaylist(id: string, playlistName: string): Promise<Track> {
    const track = await this.trackModel.findById(id).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    track.playlist = track.playlist.filter((p) => p !== playlistName);
    return track.save();
  }

  async getFavorites(): Promise<Track[]> {
    return this.trackModel.find({ rating: 1 }).exec();
  }

  async getDistinctArtists(): Promise<string[]> {
    return this.trackModel.distinct('artist').exec();
  }

  async getDistinctPlaylists(): Promise<string[]> {
    return this.trackModel.distinct('playlist').exec();
  }
}

