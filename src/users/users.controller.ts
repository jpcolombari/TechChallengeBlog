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
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.PROFESSOR)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário (Professor ou Aluno)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @Roles(UserRole.PROFESSOR, UserRole.STUDENT)
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  getProfile(@Request() req) {
    // req.user is populated by JwtStrategy (contains userId, username, role)
    return this.usersService.findOneById(req.user.userId);
  }

  @Get()
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
  @ApiOperation({ summary: 'Atualizar dados de um usuário existente' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um usuário do sistema' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}