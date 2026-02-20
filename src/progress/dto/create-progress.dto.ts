import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProgressDto {
  @ApiProperty({
    description: 'O id do usuário (Aluno)',
    example: '6996232084a22cedd42c6953',
  })
  userId: string;

  @ApiProperty({
    description: 'O id do post',
    example: '69961c8c84a22cedd42c6920',
  })
  postId: string;

  @ApiProperty({
    description: 'Se o post está completo',
    example: 'true',
  })
  completed: boolean;
}

export class ValidateProgressDto {
  @ApiProperty({ example: 'ID_DO_USUARIO' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'ID_DO_POST' })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ example: 'true' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}