import { ConflictException } from '@nestjs/common';

export class OrderAlreadyConfirmedException extends ConflictException {
  constructor() {
    super('Este pedido já foi confirmado.');
  }
}