import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductStatusEnum } from '../../../common/products/enums/product-status.enum';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const product = new ProductEntity({
      ...createProductDto,
      status: ProductStatusEnum.AVAILABLE,
    });

    return await this.productsRepository.save(product);
  }
}
