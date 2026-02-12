import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'O título da postagem',
    example: 'O que é Nest.js?',
  })
  title: string;

  @ApiProperty({
    description: 'O conteúdo principal da postagem, em texto.',
    example: 'Nest.js é um framework Node.js para construir aplicações...',
  })
  content: string;

  @ApiProperty({
    description: 'O nome do autor da postagem.',
    example: 'João Colombari',
  })
  author: string;

  @ApiProperty({
    description: 'Quiz gerado por IA',
    required: false,
    type: Object,
  })
  quiz?: {
    question: string;
    answer: boolean;
    explanation: string;
  };
}