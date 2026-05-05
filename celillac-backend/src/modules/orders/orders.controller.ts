import { Controller, Param, Post } from '@nestjs/common';
import { ConfirmOrderResponseDto } from './dto/confirm-order-response.dto';
import { OrdersService } from './services/orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post(':id/confirm')
    async confirmOrder(@Param('id') orderId: string,
    ): Promise<ConfirmOrderResponseDto> {
        return this.ordersService.confirmOrder(orderId);
    }
}