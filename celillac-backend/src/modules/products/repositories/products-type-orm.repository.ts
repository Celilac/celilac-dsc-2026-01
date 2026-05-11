import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { IProductsRepository } from './products.repository.interface';

@Injectable()
export class ProductsTypeOrmRepository implements IProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async save(product: ProductEntity): Promise<ProductEntity> {
    return await this.repository.save(product);
  }
}
