import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductStatusEnum } from '../../common/products/enums/product-status.enum';

@Injectable()
export class ProductsService {
  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return new ProductEntity({
      ...createProductDto,
      status: ProductStatusEnum.AVAILABLE,
    });
  }
}
