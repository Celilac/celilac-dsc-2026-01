import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ORDERS_REPOSITORY } from './repositories/orders.repository.interface';
import { PaymentsModule } from '../payments/payments.module';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './orders.controller';
import { OrdersTypeORMRepository } from './repositories/orders-type-orm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), PaymentsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: ORDERS_REPOSITORY,
      useClass: OrdersTypeORMRepository,
    },
  ],
  exports: [ORDERS_REPOSITORY, OrdersService],
})
export class OrdersModule {}
