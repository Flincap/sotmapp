import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { Message } from '../schemas/message.schema';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async onModuleInit() {
    await this.syncCategoriesCollection();
  }

  async syncCategoriesCollection() {
    const categoryCounts = await this.messageModel.aggregate([
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const operations = categoryCounts.map((count) => ({
      updateOne: {
        filter: { name: count._id },
        update: { $set: { messageCount: count.count } },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await this.categoryModel.bulkWrite(operations);
    }

    const activeCategories = categoryCounts.map((count) => count._id);
    await this.categoryModel.deleteMany({
      name: { $nin: activeCategories },
    });
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }
}
