import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesController } from './messages.controller';
import { MessageSchema, Message } from '../schemas/message.schema';
import { MessagesService } from './messages.service';
import { HttpModule } from '@nestjs/axios';
import { SeriesModule } from '../series/series.module';
import { SpeakersModule } from '../speakers/speakers.module';
import { SpecialMeetingsModule } from '../special-meetings/special-meetings.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    HttpModule,
    SpeakersModule,
    SeriesModule,
    SpecialMeetingsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
