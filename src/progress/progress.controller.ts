import { Controller, Post, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto, ValidateProgressDto } from './dto/create-progress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

//  @Post()
//  async create(@Body() createProgressDto: CreateProgressDto) {
//    return this.progressService.markAsCompleted(
//      createProgressDto.userId, 
//      createProgressDto.postId
//    );
//  }

  @Post('validate')
    async validate(@Body() validateDto: ValidateProgressDto) { // Use o DTO aqui
      return this.progressService.validateAndRecord(
        validateDto.userId, 
        validateDto.postId, 
        validateDto.answer
      );
    }
}