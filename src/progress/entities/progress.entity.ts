import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose'; 

@Schema()
export class Progress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  postId: string;

  @Prop({ default: true })
  completed: boolean;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);