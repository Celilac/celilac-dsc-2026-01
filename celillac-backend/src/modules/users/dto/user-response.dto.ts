import { UserEntity } from '../entities/user.entity';

export type UserResponseDto = Omit<UserEntity, 'password'>;
