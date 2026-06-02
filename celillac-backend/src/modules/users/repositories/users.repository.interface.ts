import { UserEntity } from '../entities/user.entity';

export interface IUsersRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
}

export const IUSERS_REPOSITORY = 'IUsersRepository';
