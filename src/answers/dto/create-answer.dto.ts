import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
    @ApiProperty({ description: 'The answer to the true/false question' })
    @IsBoolean()
    @IsNotEmpty()
    answer: boolean;
}
