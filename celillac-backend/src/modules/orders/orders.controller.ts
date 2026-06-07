import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ConfirmOrderResponseDto } from './dto/confirm-order-response.dto';
import { OrdersService } from './services/orders.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../common/users/enums/user-role.enum';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post(':id/confirm')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRoleEnum.ADMIN)
    async confirmOrder(@Param('id') orderId: string): Promise<ConfirmOrderResponseDto> {
        return this.ordersService.confirmOrder(orderId);
    }
}