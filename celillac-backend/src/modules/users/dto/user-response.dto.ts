import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../../../common/users/enums/user-role.enum';
import { UserEntity } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid', description: 'The unique identifier of the user' })
  userId: string;

  @ApiProperty({ example: 'Everton Coimbra', description: 'The name of the user' })
  name: string;

  @ApiProperty({ example: 'admin@example.com', description: 'The email of the user' })
  email: string;

  @ApiProperty({ enum: UserRoleEnum, example: UserRoleEnum.USER, description: 'The role of the user' })
  role: UserRoleEnum;

  @ApiProperty({ description: 'The creation date of the user record' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the user record' })
  updatedAt: Date;

  @ApiProperty({ required: false, type: Date, nullable: true, description: 'The deletion date of the user record if soft deleted' })
  deletedAt: Date | null;

  static fromEntity(entity: UserEntity): UserResponseDto {
    const { password, ...rest } = entity;
    return Object.assign(new UserResponseDto(), rest);
  }
}
