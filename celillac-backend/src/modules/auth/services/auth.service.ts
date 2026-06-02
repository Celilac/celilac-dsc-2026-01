import { Inject, Injectable } from '@nestjs/common';
import { IUSERS_REPOSITORY } from '../../users/repositories/users.repository.interface';
import type { IUsersRepository } from '../../users/repositories/users.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { InvalidCredentialsException } from '../../../common/auth/exceptions/invalid-credentials.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IUSERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: UserResponseDto }> {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user || user.deletedAt) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    // Omit password from returned user entity
    const { password, ...userWithoutPassword } = user;

    return {
      accessToken,
      user: userWithoutPassword,
    };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Logout realizado com sucesso.' };
  }
}
