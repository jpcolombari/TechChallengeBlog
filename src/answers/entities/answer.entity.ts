import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema({ timestamps: true })
export class Answer {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: string;

    @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
    postId: string;

    @Prop({ required: true })
    isCorrect: boolean;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

// Ensure a user can only answer a post once
AnswerSchema.index({ userId: 1, postId: 1 }, { unique: true });
