import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './modules/payments/entities/payment.entity';
import { OrderEntity } from './modules/orders/entities/order.entity';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductEntity } from './modules/products/entities/product.entity';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    OrdersModule,
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: Number(configService.get<string>('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [OrderEntity, PaymentEntity, ProductEntity],
      synchronize: true,
    }),
  }),
  ProductsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
