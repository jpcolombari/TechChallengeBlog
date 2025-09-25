import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'O nome do professor',
    example: 'Professor Teste',
  })
  name: string;

  @ApiProperty({
    description: 'O e-mail de login do professor',
    example: 'professor@teste.com',
  })
  email: string;

  @ApiProperty({
    description: 'A senha para a conta do professor',
    example: 'senhaForte123!',
  })
  password: string;
}