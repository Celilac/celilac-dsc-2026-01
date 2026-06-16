import { NotFoundException } from '@nestjs/common';

export class PaymentNotFoundException extends NotFoundException {
  constructor() {
    super('Pagamento não encontrado.');
  }
}