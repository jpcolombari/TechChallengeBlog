import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiQuery, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role === UserRole.PROFESSOR) {
      throw new ForbiddenException('O cadastro aberto é permitido apenas para Estudantes.');
    }
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  getProfile(@Request() req) {
    // req.user is populated by JwtStrategy (contains userId, username, role)
    return this.usersService.findOneById(req.user.userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuários com paginação e filtro por cargo' })
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Query('role') role?: UserRole,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAll(role, Number(page), Number(limit));
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados de um usuário existente' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um usuário do sistema' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}