import { Test, TestingModule } from '@nestjs/testing';
import { IUSERS_REPOSITORY } from '../../users/repositories/users.repository.interface';
import type { IUsersRepository } from '../../users/repositories/users.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRoleEnum } from '../../../common/users/enums/user-role.enum';
import { InvalidCredentialsException } from '../../../common/auth/exceptions/invalid-credentials.exception';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<IUsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersRepository: IUsersRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: IUSERS_REPOSITORY,
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(IUSERS_REPOSITORY);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const email = 'user@example.com';
    const rawPassword = 'password123';
    const hashedPassword = 'hashed_password';

    it('should authenticate successfully with valid credentials', async () => {
      const user = new UserEntity({
        userId: 'uuid-1234',
        name: 'User Test',
        email,
        password: hashedPassword,
        role: UserRoleEnum.USER,
      });

      usersRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token-abc');

      const result = await service.login({ email, password: rawPassword });

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('jwt-token-abc');
      expect(result.user.userId).toBe(user.userId);
      expect(result.user.email).toBe(user.email);
      expect((result.user as any).password).toBeUndefined();
      expect((result.user as any).name).toBeUndefined();
      expect((result.user as any).createdAt).toBeUndefined();
      expect((result.user as any).updatedAt).toBeUndefined();
      expect((result.user as any).deletedAt).toBeUndefined();

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(rawPassword, hashedPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.userId,
        email: user.email,
        role: user.role,
      });
    });

    it('should throw InvalidCredentialsException if email is not found', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@example.com', password: rawPassword }),
      ).rejects.toThrow(InvalidCredentialsException);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith('unknown@example.com');
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw InvalidCredentialsException if password is incorrect', async () => {
      const user = new UserEntity({
        userId: 'uuid-1234',
        email,
        password: hashedPassword,
      });

      usersRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email, password: 'wrongpassword' }),
      ).rejects.toThrow(InvalidCredentialsException);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', hashedPassword);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should return a logout success message', async () => {
      const result = await service.logout();
      expect(result).toEqual({ message: 'Logout realizado com sucesso.' });
    });
  });
});
