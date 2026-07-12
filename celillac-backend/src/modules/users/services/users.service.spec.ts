import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRoleEnum } from '../../../common/users/enums/user-role.enum';
import { IUSERS_REPOSITORY } from '../repositories/users.repository.interface';
import type { IUsersRepository } from '../repositories/users.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { UserEmailAlreadyExistsException } from '../../../common/users/exceptions/user-email-already-exists.exception';
import { UserNotFoundException } from '../../../common/users/exceptions/user-not-found.exception';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

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
      findById: jest.fn(),
      findAll: jest.fn(),
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
        return Promise.resolve(
          new UserEntity({
            ...user,
            userId: 'generated-uuid-1234',
          }),
        );
      });

      const result = await service.create(mockCreateUserDto);

      expect(result).toBeDefined();
      expect(result.userId).toBe('generated-uuid-1234');
      expect(result.name).toBe(mockCreateUserDto.name);
      expect(result.email).toBe(mockCreateUserDto.email);
      expect((result as any).password).toBeUndefined();
      expect(result.role).toBe(mockCreateUserDto.role);
      expect(repository.findByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
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

      expect(repository.findByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should call bcrypt.hash to secure the password', async () => {
      const hashedPassword = 'secure_hashed_password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      repository.findByEmail.mockResolvedValue(null);
      repository.save.mockImplementation((user: UserEntity) =>
        Promise.resolve(user),
      );

      await service.create(mockCreateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateUserDto.password, 10);
    });
  });

  describe('findById', () => {
    it('should return the user if found', async () => {
      const user = new UserEntity({
        userId: 'existing-id',
        name: 'User',
        email: 'user@example.com',
        role: UserRoleEnum.USER,
      });
      repository.findById.mockResolvedValue(user);

      const result = await service.findById('existing-id');

      expect(result).toBeDefined();
      expect(result.userId).toBe('existing-id');
      expect(repository.findById).toHaveBeenCalledWith('existing-id');
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existing')).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw UserNotFoundException if user is soft-deleted', async () => {
      const deletedUser = new UserEntity({
        userId: 'deleted-id',
        name: 'Deleted',
        deletedAt: new Date(),
      });
      repository.findById.mockResolvedValue(deletedUser);

      await expect(service.findById('deleted-id')).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted users', async () => {
      const users = [
        new UserEntity({ userId: '1', name: 'User 1' }),
        new UserEntity({ userId: '2', name: 'User 2', deletedAt: new Date() }),
        new UserEntity({ userId: '3', name: 'User 3' }),
      ];
      repository.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].userId).toBe('1');
      expect(result[1].userId).toBe('3');
    });
  });

  describe('update', () => {
    it('should update name successfully', async () => {
      const user = new UserEntity({
        userId: 'existing-id',
        name: 'Old Name',
      });
      repository.findById.mockResolvedValue(user);
      repository.save.mockImplementation((u) => Promise.resolve(u));

      const result = await service.update('existing-id', { name: 'New Name' });

      expect(result.name).toBe('New Name');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should hash and update password successfully', async () => {
      const user = new UserEntity({
        userId: 'existing-id',
        password: 'old_hashed_password',
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      repository.findById.mockResolvedValue(user);
      repository.save.mockImplementation((u) => Promise.resolve(u));

      await service.update('existing-id', { password: 'newpassword123' });

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw UserNotFoundException if user to update does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existing', { name: 'Name' }),
      ).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('delete', () => {
    it('should perform soft delete successfully by setting deletedAt', async () => {
      const user = new UserEntity({
        userId: 'existing-id',
        name: 'User',
      });
      repository.findById.mockResolvedValue(user);
      repository.save.mockImplementation((u) => Promise.resolve(u));

      await service.delete('existing-id');

      expect(user.deletedAt).toBeDefined();
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should throw UserNotFoundException if user to delete does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existing')).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });
});
