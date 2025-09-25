import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  // Mock do Mongoose Model para o User
  const mockUserModel = {
    create: jest.fn().mockImplementation((dto) => dto),
    findOne: jest.fn().mockResolvedValue(null), // Simula não encontrar usuário por padrão
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        // Fornece a simulação para o Mongoose Model
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});