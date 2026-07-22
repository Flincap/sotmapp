import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createId } from '@paralleldrive/cuid2';

@Schema({ timestamps: true, collection: 'series' })
export class Series extends Document {
  @Prop({ type: String, default: () => createId() })
  declare _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  title: string;

  @Prop({ required: true, default: 0 })
  messageCount: number;
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
