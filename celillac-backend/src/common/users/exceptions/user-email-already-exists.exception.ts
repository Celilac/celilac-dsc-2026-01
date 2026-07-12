import { ConflictException } from '@nestjs/common';

export class UserEmailAlreadyExistsException extends ConflictException {
  constructor() {
    super('O e-mail informado já está em uso.');
  }
}
