import {
  BadRequestException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Speaker } from '../schemas/speaker.schema';
import { Message } from '../schemas/message.schema';

@Injectable()
export class SpeakersService implements OnModuleInit {
  constructor(
    @InjectModel(Speaker.name) private speakerModel: Model<Speaker>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async onModuleInit() {
    await this.syncSpeakersCollection();
  }

  async syncSpeakersCollection() {
    const speakerCounts = await this.messageModel.aggregate([
      {
        $group: {
          _id: '$speaker',
          count: { $sum: 1 },
        },
      },
    ]);

    const operations = speakerCounts.map((count) => ({
      updateOne: {
        filter: { name: count._id },
        update: { $set: { messageCount: count.count } },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await this.speakerModel.bulkWrite(operations);
    }

    const activeSpeakers = speakerCounts.map((count) => count._id);
    await this.speakerModel.deleteMany({
      name: { $nin: activeSpeakers },
      manual: { $ne: true },
    });
  }

  async findAll(): Promise<Speaker[]> {
    return this.speakerModel.find().sort({ name: 1 }).exec();
  }

  async create(name: string): Promise<Speaker> {
    const trimmed = name.trim();
    if (!trimmed) throw new BadRequestException('Speaker name is required');
    const existing = await this.speakerModel
      .findOne({ name: trimmed })
      .collation({ locale: 'en', strength: 2 })
      .exec();
    if (existing) {
      throw new BadRequestException('A speaker with this name already exists');
    }
    return this.speakerModel.create({
      name: trimmed,
      messageCount: 0,
      manual: true,
    });
  }

  async incrementMessageCount(speakerName: string): Promise<void> {
    await this.speakerModel.findOneAndUpdate(
      { name: speakerName },
      { $inc: { messageCount: 1 } },
      { new: true, upsert: true }, // Added upsert: true to create if doesn't exist
    );
  }

  async decrementMessageCount(speakerName: string): Promise<void> {
    await this.speakerModel.findOneAndUpdate(
      { name: speakerName },
      { $inc: { messageCount: -1 } },
      { new: true },
    );

    await this.speakerModel.deleteOne({
      name: speakerName,
      messageCount: { $lte: 0 },
    });
  }
}
