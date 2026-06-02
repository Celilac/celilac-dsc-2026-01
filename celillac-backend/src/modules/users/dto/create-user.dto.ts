import { UserRoleEnum } from '../../../common/users/enums/user-role.enum';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
}
