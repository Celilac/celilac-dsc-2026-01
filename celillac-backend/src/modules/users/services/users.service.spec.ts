import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRoleEnum } from '../../../common/users/enums/user-role.enum';
import { IUSERS_REPOSITORY } from '../repositories/users.repository.interface';
import type { IUsersRepository } from '../repositories/users.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { UserEmailAlreadyExistsException } from '../../../common/users/exceptions/user-email-already-exists.exception';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<IUsersRepository>;

  const mockCreateUserDto: CreateUserDto = {
    name: 'Everton Coimbra',
    email: 'everton@example.com',
    password: 'password123',
    role: UserRoleEnum.USER,
  };

  beforeEach(async () => {
    const mockUsersRepository: IUsersRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: IUSERS_REPOSITORY,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(IUSERS_REPOSITORY);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully with valid data', async () => {
      const hashedPassword = 'hashed_password123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      repository.findByEmail.mockResolvedValue(null);
      repository.save.mockImplementation((user: UserEntity) => {
        return Promise.resolve(new UserEntity({
          ...user,
          userId: 'generated-uuid-1234',
        }));
      });

      const result = await service.create(mockCreateUserDto);

      expect(result).toBeDefined();
      expect(result.userId).toBe('generated-uuid-1234');
      expect(result.name).toBe(mockCreateUserDto.name);
      expect(result.email).toBe(mockCreateUserDto.email);
      expect(result.password).toBe(hashedPassword);
      expect(result.role).toBe(mockCreateUserDto.role);
      expect(repository.findByEmail).toHaveBeenCalledWith(mockCreateUserDto.email);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw UserEmailAlreadyExistsException when email already exists', async () => {
      const existingUser = new UserEntity({
        userId: 'existing-uuid',
        name: 'Existing User',
        email: mockCreateUserDto.email,
        password: 'existing_hashed_password',
        role: UserRoleEnum.USER,
      });

      repository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        UserEmailAlreadyExistsException,
      );

      expect(repository.findByEmail).toHaveBeenCalledWith(mockCreateUserDto.email);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should call bcrypt.hash to secure the password', async () => {
      const hashedPassword = 'secure_hashed_password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      repository.findByEmail.mockResolvedValue(null);
      repository.save.mockImplementation((user: UserEntity) => Promise.resolve(user));

      await service.create(mockCreateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateUserDto.password, 10);
    });
  });
});
