import { Payment } from "../entities/payment.entity";

export const PAYMENTS_REPOSITORY = 'PAYMENTS_REPOSITORY';

export interface PaymentsRepository {
  findByOrderId(orderId: string): Promise<Payment | null>;
}