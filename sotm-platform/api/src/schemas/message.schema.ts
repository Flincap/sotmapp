import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createId } from '@paralleldrive/cuid2';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({
    type: String,
    default: () => createId(),
  })
  declare _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  speaker: string;

  @Prop()
  size: string;

  @Prop()
  downloadUrl: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop()
  imageUrl: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: [String] })
  category: string[];

  @Prop({ default: false })
  isSeries: boolean;

  @Prop({
    required: function (this: Message) {
      return this.isSeries === true;
    },
    validate: {
      validator: function (this: Message, v: string) {
        return !(this.isSeries === true && !v);
      },
      message: 'Series title is required when isSeries is true',
    },
  })
  seriesTitle: string;

  @Prop({ default: false })
  specialMeeting: boolean;

  @Prop({
    required: function (this: Message) {
      return this.specialMeeting === true;
    },
    validate: {
      validator: function (this: Message, v: string) {
        return !(this.specialMeeting === true && !v);
      },
      message: 'Special meeting name is required when specialMeeting is true',
    },
  })
  specialMeetingName: string;

  @Prop({
    validate: {
      validator: function (v: string) {
        return !v || v.length <= 400;
      },
      message: 'Description should not exceed 400 characters',
    },
  })
  description: string;

  @Prop()
  duration: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
