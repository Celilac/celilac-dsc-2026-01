import { OrderStatusEnum } from "src/common/enums/order-status.enum";

export class ConfirmOrderResponseDto {
    constructor(
        public orderId: string,
        public orderStatus: OrderStatusEnum,
    ) { }
}