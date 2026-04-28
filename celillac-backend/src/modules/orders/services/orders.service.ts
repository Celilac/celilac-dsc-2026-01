import { Inject, Injectable } from "@nestjs/common";
import { ORDERS_REPOSITORY } from "../repositories/orders.repository.interface";
import type { OrdersRepository } from "../repositories/orders.repository.interface";
import { ConfirmOrderResponseDto } from "../dto/confirm-order-response.dto";
import { OrderNotFoundException } from "../../../common/exceptions/order-not-found.exception";

@Injectable()
export class OrdersService {
    constructor(
        @Inject(ORDERS_REPOSITORY)
        private readonly ordersRepository: OrdersRepository,
    ) { }

    async confirmOrder(orderId: string) {
        const order = await this.ordersRepository.findById(orderId);

        if (!order) {
            throw new OrderNotFoundException(orderId);
        }

        throw new Error("Method not implemented.");
    } //: Promise<ConfirmOrderResponseDto> {

}
