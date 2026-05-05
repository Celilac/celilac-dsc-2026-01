import { OrderStatusEnum } from "src/common/orders/enums/order-status.enum";

export class ConfirmOrderResponseDto {
    constructor(
        public orderId: string,
        public orderStatus: OrderStatusEnum,
    ) { }
}