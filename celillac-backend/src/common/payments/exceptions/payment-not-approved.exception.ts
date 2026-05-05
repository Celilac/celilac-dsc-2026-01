import { PaymentStatusEnum } from '../../../common/payments/enums/payment-status.enum';
import { BadRequestException } from '@nestjs/common';

export class PaymentNotApprovedException extends BadRequestException {
  constructor(status: PaymentStatusEnum) {
    super(`Payment is not approved. Current status: ${status}`);
  }
}