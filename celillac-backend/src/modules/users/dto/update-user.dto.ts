import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Everton Coimbra', description: 'The name of the user' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'newpassword123', description: 'The new password of the user', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
