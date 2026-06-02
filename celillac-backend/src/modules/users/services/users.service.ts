import { Inject, Injectable } from '@nestjs/common';
import { IUSERS_REPOSITORY } from '../repositories/users.repository.interface';
import type { IUsersRepository } from '../repositories/users.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserEmailAlreadyExistsException } from '../../../common/users/exceptions/user-email-already-exists.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUSERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
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

    return this.usersRepository.save(user);
  }
}
