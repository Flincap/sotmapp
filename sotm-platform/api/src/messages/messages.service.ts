import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { Message } from '../schemas/message.schema';
import { SpeakersService } from '../speakers/speakers.service';
import { SeriesService } from '../series/series.service';
import { SpecialMeetingsService } from '../special-meetings/special-meetings.service';


function escapeRegex(value: unknown): string {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private speakersService: SpeakersService,
    private seriesService: SeriesService,
    private specialMeetingsService: SpecialMeetingsService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = await this.messageModel.create(createMessageDto);
    await this.speakersService.incrementMessageCount(createMessageDto.speaker);
    if (createMessageDto.isSeries) {
      await this.seriesService.incrementMessageCount(
        createMessageDto.seriesTitle,
      );
    }
    if (createMessageDto.specialMeeting) {
      await this.specialMeetingsService.incrementMessageCount(
        createMessageDto.specialMeetingName,
      );
    }

    return message;
  }

  async getStats() {
    const [totalMessages, messagesByYear, messagesByCategory, speakers] =
      await Promise.all([
        this.messageModel.countDocuments(),
        this.messageModel.aggregate([
          {
            $group: {
              _id: { $year: '$date' },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: -1 } },
        ]),
        this.messageModel.aggregate([
          { $unwind: '$category' },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),
        // this.messageModel.aggregate([
        //   {
        //     $group: {
        //       _id: '$speaker',
        //       count: { $sum: 1 },
        //     },
        //   },
        //   { $sort: { count: -1 } },
        // ]),
        this.speakersService.findAll(),
      ]);

    const messagesBySpeaker = speakers.map((speaker) => ({
      _id: speaker.name,
      count: speaker.messageCount,
    }));

    return {
      totalMessages,
      messagesByYear,
      messagesByCategory,
      messagesBySpeaker,
    };
  }

  async findAllAdmin(filters: any): Promise<Message[]> {
    const query: any = {};
    if (filters.year) {
      query.$expr = {
        $eq: [{ $year: '$date' }, parseInt(filters.year, 10)],
      };
    }
    if (filters.category) {
      query.category = {
        $elemMatch: {
          $regex: escapeRegex(filters.category),
          $options: 'i',
        },
      };
    }
    if (filters.speaker) {
      query.speaker = {
        $regex: escapeRegex(filters.speaker),
        $options: 'i',
      };
    }
    if (filters.search) {
      const searchRegex = new RegExp(escapeRegex(filters.search), 'i');
      // More search options can be added here, e.g., searching in other fields
      query.$or = [{ title: searchRegex }];
    }
    return this.messageModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id).exec();
    if (!message) throw new NotFoundException('Message not found!');
    return message;
  }

  async findAll(
    filters: any,
    pagination: { page: number; limit: number },
    sortOptions?: { field: string; order: 'asc' | 'desc' },
  ): Promise<{
    data: Message[];
    totalMessages: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (filters.year) {
      query.$expr = {
        $eq: [{ $year: '$date' }, parseInt(filters.year, 10)],
      };
    }

    if (filters.category) {
      query.category = {
        $elemMatch: {
          $regex: escapeRegex(filters.category),
          $options: 'i',
        },
      };
    }

    if (filters.speaker) {
      query.speaker = {
        $regex: escapeRegex(filters.speaker),
        $options: 'i',
      };
    }

    if (filters.specialMeetingName) {
      query.specialMeetingName = {
        $regex: escapeRegex(filters.specialMeetingName),
        $options: 'i',
      };
    }

    if (filters.search) {
      const searchRegex = new RegExp(escapeRegex(filters.search), 'i');
      // More search options can be added here, e.g., searching in other fields
      query.$or = [{ title: searchRegex }];
    }

    const skip = (pagination.page - 1) * pagination.limit;

    let sortCriteria: any = { createdAt: -1 };

    if (sortOptions) {
      sortCriteria = {
        [sortOptions.field]: sortOptions.order === 'asc' ? 1 : -1,
      };
    }

    const [messages, totalMessages] = await Promise.all([
      this.messageModel
        .find(query)
        .sort(sortCriteria)
        .skip(skip)
        .limit(pagination.limit)
        .exec(),
      this.messageModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(totalMessages / pagination.limit);

    if (pagination.page > totalPages && totalPages > 0) {
      throw new BadRequestException(
        `Page ${pagination.page} exceeds total pages (${totalPages}).`,
      );
    }

    return {
      data: messages,
      totalMessages,
      currentPage: pagination.page,
      limit: pagination.limit,
      totalPages,
    };
  }

  async findFeatured(): Promise<Message[]> {
    return this.messageModel
      .find({ featured: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const oldMessage = await this.messageModel.findById(id);
    if (!oldMessage) throw new NotFoundException('Message not found!');

    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(id, updateMessageDto, { new: true })
      .exec();
    if (!updatedMessage) throw new NotFoundException('Message not found!');

    // If speaker changed, update speaker counts
    if (
      updateMessageDto.speaker &&
      updateMessageDto.speaker !== oldMessage.speaker
    ) {
      await Promise.all([
        this.speakersService.decrementMessageCount(oldMessage.speaker),
        this.speakersService.syncSpeakersCollection(), // This will create new speaker if needed
      ]);
    }

    // Handle special meeting changes
    if (
      // Case 1: Special meeting status changed (was special meeting, now not special meeting)
      (updateMessageDto.specialMeeting === false &&
        oldMessage.specialMeeting) ||
      // Case 2: Still a special meeting but special meeting name changed
      (updateMessageDto.specialMeeting &&
        oldMessage.specialMeeting &&
        updateMessageDto.specialMeetingName &&
        updateMessageDto.specialMeetingName !== oldMessage.specialMeetingName)
    ) {
      // Remove from old special meeting
      await this.specialMeetingsService.decrementMessageCount(
        oldMessage.specialMeetingName,
      );

      // If it's still a special meeting with a new name, add to new special meeting
      if (
        updateMessageDto.specialMeeting &&
        updateMessageDto.specialMeetingName
      ) {
        await this.specialMeetingsService.incrementMessageCount(
          updateMessageDto.specialMeetingName,
        );
      }

      // Always sync the special meeting collection after changes
      await this.specialMeetingsService.syncSpecialMeetingCollection();
    }

    // Handle series changes
    if (
      // Case 1: Series status changed (was series, now not series)
      (updateMessageDto.isSeries === false && oldMessage.isSeries) ||
      // Case 2: Still a series but series title changed
      (updateMessageDto.isSeries &&
        oldMessage.isSeries &&
        updateMessageDto.seriesTitle &&
        updateMessageDto.seriesTitle !== oldMessage.seriesTitle)
    ) {
      // Remove from old series
      await this.seriesService.decrementMessageCount(oldMessage.seriesTitle);

      // If it's still a series with a new title, add to new series
      if (updateMessageDto.isSeries && updateMessageDto.seriesTitle) {
        await this.seriesService.incrementMessageCount(
          updateMessageDto.seriesTitle,
        );
      }

      // Always sync the series collection after changes
      await this.seriesService.syncSeriesCollection();
    }
    // Case 3: Wasn't a series before, now is a series
    else if (
      updateMessageDto.isSeries &&
      !oldMessage.isSeries &&
      updateMessageDto.seriesTitle
    ) {
      await this.seriesService.incrementMessageCount(
        updateMessageDto.seriesTitle,
      );
      await this.seriesService.syncSeriesCollection();
    }
    // Case 4: No change in series status, but always sync to be safe
    else if (updateMessageDto.isSeries || oldMessage.isSeries) {
      await this.seriesService.syncSeriesCollection();
    }

    return updatedMessage;
  }

  async delete(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id);
    if (!message) throw new NotFoundException('Message not found!');

    await this.speakersService.decrementMessageCount(message.speaker);
    if (message.isSeries) {
      await this.seriesService.decrementMessageCount(message.seriesTitle);
    }
    if (message.specialMeeting) {
      await this.specialMeetingsService.decrementMessageCount(
        message.specialMeetingName,
      );
    }

    const deletedMessage = await this.messageModel.findByIdAndDelete(id).exec();
    if (!deletedMessage) throw new NotFoundException('Message not found!');

    return deletedMessage;
  }

  async toggleFeatured(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id);
    if (!message) throw new NotFoundException('Message not found!');

    // Get current featured status, defaulting to false if undefined
    const currentlyFeatured = message.featured || false;

    // If we're trying to feature a sermon and it's not already featured
    if (!currentlyFeatured) {
      // Count current featured sermons
      const featuredCount = await this.messageModel.countDocuments({
        featured: true,
      });

      // Check if we already have 4 featured sermons
      if (featuredCount >= 4) {
        throw new BadRequestException(
          'Maximum of 4 featured sermons allowed. Please unfeature another sermon first.',
        );
      }
    }

    // Toggle the featured status
    message.featured = !currentlyFeatured;
    return message.save();
  }
}
