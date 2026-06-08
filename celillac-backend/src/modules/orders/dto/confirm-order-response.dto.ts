import { OrderStatusEnum } from "src/common/orders/enums/order-status.enum";
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmOrderResponseDto {
    @ApiProperty({ format: 'uuid', description: 'The unique identifier of the confirmed order' })
    public orderId: string;

    @ApiProperty({ enum: OrderStatusEnum, example: OrderStatusEnum.CONFIRMED, description: 'The new status of the order' })
    public orderStatus: OrderStatusEnum;

    constructor(orderId: string, orderStatus: OrderStatusEnum) {
        this.orderId = orderId;
        this.orderStatus = orderStatus;
    }
}