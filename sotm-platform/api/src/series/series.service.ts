import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Series } from '../schemas/series.schema';
import { Message } from '../schemas/message.schema';

@Injectable()
export class SeriesService implements OnModuleInit {
  constructor(
    @InjectModel(Series.name) private seriesModel: Model<Series>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async onModuleInit() {
    await this.syncSeriesCollection();
  }

  async syncSeriesCollection() {
    // First, delete any series with null title to clean up existing issues
    await this.seriesModel.deleteMany({ title: null });

    const seriesCounts = await this.messageModel.aggregate([
      {
        $match: {
          isSeries: true,
          $and: [
            { seriesTitle: { $exists: true } },
            { seriesTitle: { $ne: null } },
            { seriesTitle: { $ne: '' } },
          ],
        },
      },
      {
        $group: {
          _id: '$seriesTitle',
          count: { $sum: 1 },
        },
      },
    ]);

    const operations = seriesCounts.map((count) => ({
      updateOne: {
        filter: { title: count._id },
        update: { $set: { messageCount: count.count } },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await this.seriesModel.bulkWrite(operations);
    }

    const activeSeries = seriesCounts.map((count) => count._id);
    await this.seriesModel.deleteMany({
      $or: [{ title: { $nin: activeSeries } }, { title: null }, { title: '' }],
    });
  }

  async findAll(): Promise<Series[]> {
    return this.seriesModel.find().sort({ title: 1 }).exec();
  }

  async incrementMessageCount(seriesTitle: string): Promise<void> {
    await this.seriesModel.findOneAndUpdate(
      { title: seriesTitle },
      { $inc: { messageCount: 1 } },
      { new: true, upsert: true },
    );
  }

  async decrementMessageCount(seriesTitle: string): Promise<void> {
    await this.seriesModel.findOneAndUpdate(
      { title: seriesTitle },
      { $inc: { messageCount: -1 } },
      { new: true },
    );

    await this.seriesModel.deleteOne({
      title: seriesTitle,
      messageCount: { $lte: 0 },
    });
  }
}
