import { Injectable, NotFoundException } from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress } from './entities/progress.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    @InjectModel('Post') private postModel: Model<any>,
    private usersService: UsersService, 
  ) {}

  async markAsCompleted(userId: string, postId: string) {
    const isStudent = await this.usersService.isStudent(userId);
    
    if (!isStudent) {
      return { 
        message: 'Apenas estudantes podem acumular pontos por leitura.', 
        gainedPoints: 0 
      };
    }

    const alreadyCompleted = await this.progressModel.findOne({ userId, postId });
    if (alreadyCompleted) {
      return { message: 'Post já concluído anteriormente', gainedPoints: 0 };
    }

    await new this.progressModel({ userId, postId, completed: true }).save();
    await this.usersService.addPoints(userId, 10);

    return { message: 'Parabéns! Você ganhou 10 pontos', gainedPoints: 10 };
  }

  async validateAndRecord(userId: string, postId: string, userAnswer: string) {
    const post = await this.postModel.findById(postId);
    
    if (!post) throw new NotFoundException('Post não encontrado');

    const correctAnswer = post.quiz?.answer;

    if (correctAnswer === undefined) {
      throw new Error('Este post não possui uma resposta cadastrada no quiz.');
    }

    const userSelectedTrue = userAnswer.toString().trim().toLowerCase() === 'true';

    if (correctAnswer !== userSelectedTrue) {
      return { 
        success: false, 
        message: 'Resposta incorreta!',
        details: { enviada: userSelectedTrue, esperada: correctAnswer } 
      };
    }

    return this.markAsCompleted(userId, postId);
  }
}