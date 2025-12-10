import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../tracks/schemas/track.schema';

@Injectable()
export class FavoritesService {
  constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>) {}

  async findAll(): Promise<Track[]> {
    return this.trackModel.find({ rating: 1 }).exec();
  }

  async toggleFavorite(trackId: string): Promise<Track> {
    const track = await this.trackModel.findById(trackId).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }

    track.rating = track.rating === 1 ? 0 : 1;
    return track.save();
  }

  async addFavorite(trackId: string): Promise<Track> {
    const track = await this.trackModel.findByIdAndUpdate(
      trackId,
      { rating: 1 },
      { new: true },
    ).exec();

    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }

    return track;
  }

  async removeFavorite(trackId: string): Promise<Track> {
    const track = await this.trackModel.findByIdAndUpdate(
      trackId,
      { rating: 0 },
      { new: true },
    ).exec();

    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }

    return track;
  }

  async isFavorite(trackId: string): Promise<boolean> {
    const track = await this.trackModel.findById(trackId).exec();
    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }
    return track.rating === 1;
  }

  async getFavoriteCount(): Promise<number> {
    return this.trackModel.countDocuments({ rating: 1 }).exec();
  }
}

