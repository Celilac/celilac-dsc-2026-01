import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ConfirmOrderResponseDto } from './dto/confirm-order-response.dto';
import { OrdersService } from './services/orders.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { UserRoleEnum } from '../../common/users/enums/user-role.enum';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Confirm an order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully confirmed.',
    type: ConfirmOrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async confirmOrder(
    @Param('id') orderId: string,
  ): Promise<ConfirmOrderResponseDto> {
    return this.ordersService.confirmOrder(orderId);
  }
}
