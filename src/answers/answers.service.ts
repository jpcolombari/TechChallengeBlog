import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer, AnswerDocument } from './entities/answer.entity';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class AnswersService {
    constructor(
        @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>,
        private usersService: UsersService,
        private postsService: PostsService,
    ) { }

    async submitAnswer(userId: string, postId: string, userAnswer: boolean) {
        // Check if user already answered
        const existingAnswer = await this.answerModel.findOne({ userId, postId }).exec();
        if (existingAnswer) {
            throw new BadRequestException('Você já respondeu a este quiz.');
        }

        // Get Post to check correct answer
        const post = await this.postsService.findOne(postId);
        if (!post) {
            throw new NotFoundException('Post não encontrado.');
        }
        if (!post.quiz) {
            throw new BadRequestException('Este post não possui quiz.');
        }

        const isCorrect = post.quiz.answer === userAnswer;

        // Save answer
        const newAnswer = new this.answerModel({
            userId,
            postId,
            isCorrect,
        });
        await newAnswer.save();

        // Give points if correct
        if (isCorrect) {
            await this.usersService.addScore(userId, 10);
        }

        return {
            isCorrect,
            explanation: post.quiz.explanation,
            message: isCorrect ? 'Resposta correta! Você ganhou 10 pontos.' : 'Resposta incorreta.',
        };
    }

    async checkUserAnswer(userId: string, postId: string) {
        const answer = await this.answerModel.findOne({ userId, postId }).exec();
        if (!answer) {
            return { answered: false };
        }

        // fetch post to return explanation
        const post = await this.postsService.findOne(postId);
        return {
            answered: true,
            isCorrect: answer.isCorrect,
            explanation: post?.quiz?.explanation,
        };
    }

    async getAnsweredPosts(userId: string): Promise<{ answeredPostIds: string[] }> {
        const answers = await this.answerModel.find({ userId }).select('postId').exec();
        const answeredPostIds = answers.map(answer => answer.postId.toString());
        return { answeredPostIds };
    }
}
