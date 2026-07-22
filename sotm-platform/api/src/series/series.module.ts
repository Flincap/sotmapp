import { Module } from '@nestjs/common';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SeriesSchema, Series } from '../schemas/series.schema';
import { MessageSchema, Message } from '../schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Series.name, schema: SeriesSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
