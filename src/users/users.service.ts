import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async onModuleInit() {
    await this.seedProfessorUser();
  }

  private async seedProfessorUser() {
    const email = 'professor@professor.com';
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      this.logger.log('Creating default Professor user...');
      const professorUser = new this.userModel({
        name: 'Professor',
        email: email,
        password: 'Teste@123',
        role: UserRole.PROFESSOR,
      });
      await professorUser.save();
      this.logger.log('Default Professor user created successfully.');
    } else {
      this.logger.log('Default Professor user already exists.');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(role?: UserRole, page: number = 1, limit: number = 10) {
    const filter = role ? { role } : {};
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      this.userModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .select('-password')
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return {
      data: results,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return deletedUser;
  }
}