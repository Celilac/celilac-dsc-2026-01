import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductStatusEnum } from '../../../common/products/enums/product-status.enum';
import { IPRODUCTS_REPOSITORY } from '../repositories/products.repository.interface';
import type { IProductsRepository } from '../repositories/products.repository.interface';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(IPRODUCTS_REPOSITORY)
    private readonly productsRepository: IProductsRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const product = new ProductEntity({
      ...createProductDto,
      status: ProductStatusEnum.AVAILABLE,
    });

    return await this.productsRepository.save(product);
  }
}
