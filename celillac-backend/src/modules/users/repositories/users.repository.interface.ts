import { UserEntity } from '../entities/user.entity';

export interface IUsersRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(userId: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<UserEntity>;
}

export const IUSERS_REPOSITORY = 'IUsersRepository';
