import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpeakersController } from './speakers.controller';
import { SpeakersService } from './speakers.service';
import { SpeakerSchema, Speaker } from '../schemas/speaker.schema';
import { MessageSchema, Message } from '../schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Speaker.name, schema: SpeakerSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [SpeakersController],
  providers: [SpeakersService],
  exports: [SpeakersService],
})
export class SpeakersModule {}
