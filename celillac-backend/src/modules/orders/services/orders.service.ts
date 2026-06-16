import { Inject, Injectable } from "@nestjs/common";
import { ORDERS_REPOSITORY } from "../repositories/orders.repository.interface";
import type { IOrdersRepository } from "../repositories/orders.repository.interface";
import { ConfirmOrderResponseDto } from "../dto/confirm-order-response.dto";
import { OrderNotFoundException } from "../../../common/orders/exceptions/order-not-found.exception";
import { OrderAlreadyConfirmedException } from "../../../common/orders/exceptions/order-already-confirmed-exception";
import type { PaymentsRepository } from "../../../modules/payments/repositories/payments.repository.interface";
import { PAYMENTS_REPOSITORY } from "../../../modules/payments/repositories/payments.repository.interface";
import { OrderStatusEnum } from "../../../common/orders/enums/order-status.enum";
import { PaymentNotFoundException } from "../../../common/payments/exceptions/payment-not-found.exception";
import { PaymentNotApprovedException } from "../../../common/payments/exceptions/payment-not-approved.exception";
import { PaymentStatusEnum } from "../../../common/payments/enums/payment-status.enum";

@Injectable()
export class OrdersService {
    constructor(
        @Inject(ORDERS_REPOSITORY)
        private readonly ordersRepository: IOrdersRepository,
        @Inject(PAYMENTS_REPOSITORY)
        private readonly paymentsRepository: PaymentsRepository,
    ) { }

    async confirmOrder(orderId: string): Promise<ConfirmOrderResponseDto> {
        const order = await this.ordersRepository.findById(orderId);

        if (!order) {
            throw new OrderNotFoundException();
        }

        if (order.status === OrderStatusEnum.CONFIRMED)
            throw new OrderAlreadyConfirmedException();

        const payment = await this.paymentsRepository.findByOrderId(orderId);
        if (!payment) throw new PaymentNotFoundException();
        if (payment.status !== PaymentStatusEnum.APPROVED)
            throw new PaymentNotApprovedException();

        order.status = OrderStatusEnum.CONFIRMED;
        order.updatedAt = new Date();
        const savedOrder = await this.ordersRepository.save(order);

        return {
            orderId: savedOrder.orderId,
            orderStatus: savedOrder.status,
        };
    }

}
