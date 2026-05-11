import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ProductEntity } from './entities/product.entity';
import { IPRODUCTS_REPOSITORY } from './repositories/products.repository.interface';
import { ProductsTypeOrmRepository } from './repositories/products-type-orm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: IPRODUCTS_REPOSITORY,
      useClass: ProductsTypeOrmRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
