import { Module } from '@nestjs/common';
import { SpecialMeetingsController } from './special-meetings.controller';
import { SpecialMeetingsService } from './special-meetings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema, Message } from '../schemas/message.schema';
import {
  SpecialMeetingSchema,
  SpecialMeeting,
} from '../schemas/special-meeting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: SpecialMeeting.name, schema: SpecialMeetingSchema },
    ]),
  ],
  controllers: [SpecialMeetingsController],
  providers: [SpecialMeetingsService],
  exports: [SpecialMeetingsService],
})
export class SpecialMeetingsModule {}
