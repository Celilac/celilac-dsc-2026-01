import { ConflictException } from '@nestjs/common';

export class OrderAlreadyConfirmedException extends ConflictException {
  constructor(orderId: string) {
    super(`Order with id "${orderId}" is already confirmed.`);
  }
}