import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { PAYMENTS_REPOSITORY } from './repositories/payments.repository.interface';
import { PaymentsTypeORMRepository } from './repositories/payment-type-orm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    {
      provide: PAYMENTS_REPOSITORY,
      useClass: PaymentsTypeORMRepository,
    },
  ],
  exports: [PAYMENTS_REPOSITORY],
})
export class PaymentsModule {}
