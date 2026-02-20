import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { Answer, AnswerSchema } from './entities/answer.entity';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
    UsersModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [AnswersController],
  providers: [AnswersService]
})
export class AnswersModule { }
