import { PaymentStatus } from '../../../common/enums/payment-status.enum';

export class Payment {
    constructor(
        public paymentId: string,
        public orderId: string,
        public status: PaymentStatus,
        public amount: number,
        public paidAt: Date | null,
        public createdAt: Date,
        public updatedAt: Date,
        public deletedAt: Date,
    ) { }
}