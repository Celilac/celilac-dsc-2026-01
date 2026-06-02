import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { IUSERS_REPOSITORY } from './repositories/users.repository.interface';
import { UsersTypeOrmRepository } from './repositories/users-type-orm.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: IUSERS_REPOSITORY,
      useClass: UsersTypeOrmRepository,
    },
  ],
  exports: [IUSERS_REPOSITORY, UsersService],
})
export class UsersModule {}
