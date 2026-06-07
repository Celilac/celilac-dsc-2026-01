import { Inject, Injectable } from '@nestjs/common';
import { IUSERS_REPOSITORY } from '../repositories/users.repository.interface';
import type { IUsersRepository } from '../repositories/users.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserEmailAlreadyExistsException } from '../../../common/users/exceptions/user-email-already-exists.exception';
import { UserNotFoundException } from '../../../common/users/exceptions/user-not-found.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUSERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UserEmailAlreadyExistsException(createUserDto.email);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new UserEntity({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });

    const savedUser = await this.usersRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findById(userId: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new UserNotFoundException(userId);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return users
      .filter((user) => !user.deletedAt)
      .map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new UserNotFoundException(userId);
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const savedUser = await this.usersRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async delete(userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.deletedAt) {
      throw new UserNotFoundException(userId);
    }
    user.deletedAt = new Date();
    await this.usersRepository.save(user);
  }
}

