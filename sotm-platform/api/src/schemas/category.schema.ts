import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createId } from '@paralleldrive/cuid2';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ type: String, default: () => createId() })
  declare _id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 0 })
  messageCount: number;

  /** True when created by an admin directly (not derived from messages).
      Sync must never delete manual entries even at zero messages. */
  @Prop({ default: false })
  manual: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);