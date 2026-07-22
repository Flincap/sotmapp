import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { SpecialMeeting } from '../schemas/special-meeting.schema';

@Injectable()
export class SpecialMeetingsService implements OnModuleInit {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(SpecialMeeting.name)
    private specialMeetingModel: Model<SpecialMeeting>,
  ) {}

  async onModuleInit() {
    await this.syncSpecialMeetingCollection();
  }

  async syncSpecialMeetingCollection() {
    await this.specialMeetingModel.deleteMany({ name: null });

    const specialMeetingCounts = await this.messageModel.aggregate([
      {
        $match: {
          specialMeeting: true,
          $and: [
            { specialMeetingName: { $exists: true } },
            { specialMeetingName: { $ne: null } },
            { specialMeetingName: { $ne: '' } },
          ],
        },
      },
      {
        $group: {
          _id: '$specialMeetingName',
          count: { $sum: 1 },
        },
      },
    ]);

    const operations = specialMeetingCounts.map((count) => ({
      updateOne: {
        filter: { name: count._id },
        update: { $set: { messageCount: count.count } },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await this.specialMeetingModel.bulkWrite(operations);
    }

    const activeSpecialMeetings = specialMeetingCounts.map(
      (count) => count._id,
    );
    await this.specialMeetingModel.deleteMany({
      $or: [
        { name: { $nin: activeSpecialMeetings } },
        { name: null },
        { name: '' },
      ],
    });
  }

  async findAll(): Promise<SpecialMeeting[]> {
    return this.specialMeetingModel.find().sort({ name: 1 }).exec();
  }

  async incrementMessageCount(specialMeetingName: string): Promise<void> {
    await this.specialMeetingModel.findOneAndUpdate(
      { name: specialMeetingName },
      { $inc: { messageCount: 1 } },
      { new: true, upsert: true },
    );
  }

  async decrementMessageCount(specialMeetingName: string): Promise<void> {
    await this.specialMeetingModel.findOneAndUpdate(
      { name: specialMeetingName },
      { $inc: { messageCount: -1 } },
      { new: true },
    );

    await this.specialMeetingModel.deleteOne({
      name: specialMeetingName,
      messageCount: { $lte: 0 },
    });
  }
}
