import { Controller, Post, Body, Param, Get, Request, UseGuards } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('answers')
@Controller('answers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AnswersController {
    constructor(private readonly answersService: AnswersService) { }

    @Post(':postId')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Responder quiz de um post' })
    async create(
        @Param('postId') postId: string,
        @Body() createAnswerDto: CreateAnswerDto,
        @Request() req
    ) {
        return this.answersService.submitAnswer(req.user.userId, postId, createAnswerDto.answer);
    }

    @Get('me/all')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Obter todos os IDs de posts respondidos pelo usuário' })
    async getAnsweredPosts(@Request() req) {
        return this.answersService.getAnsweredPosts(req.user.userId);
    }

    @Get(':postId/me')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Verificar resposta do usuário para o post' })
    async checkAnswer(@Param('postId') postId: string, @Request() req) {
        return this.answersService.checkUserAnswer(req.user.userId, postId);
    }
}
