import { BadRequestException } from '@nestjs/common';

export class PaymentNotApprovedException extends BadRequestException {
  constructor() {
    super('O pagamento não foi aprovado.');
  }
}
