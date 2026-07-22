import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { createId } from '@paralleldrive/cuid2';

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({
    type: String,
    default: () => createId(),
  })
  declare _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: true })
  isAdmin: boolean;

  @Prop({ default: false })
  isSuperAdmin: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
