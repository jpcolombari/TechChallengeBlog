import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'O e-mail de login do usuário',
    example: 'professor@fiap.com.br',
  })
  email: string;

  @ApiProperty({
    description: 'A senha do usuário',
    example: 'senhaForte123',
  })
  password: string;
}