import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'O nome do usuário (Professor ou Aluno)',
    example: 'Maria Silva',
  })
  name: string;

  @ApiProperty({
    description: 'O e-mail de login',
    example: 'maria@fiap.com.br',
  })
  email: string;

  @ApiProperty({
    description: 'A senha de acesso',
    example: 'senhaForte123!',
  })
  password: string;

  @ApiProperty({
    description: 'O perfil do usuário (PROFESSOR ou STUDENT)',
    enum: UserRole,
    example: UserRole.STUDENT,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({ 
    description: 'Total de pontos acumulados pelo usuário', 
    example: 100, 
    default: 0
  })
  points: number;

}