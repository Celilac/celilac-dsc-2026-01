import { ProductEntity } from '../entities/product.entity';

export interface IProductsRepository {
  save(product: ProductEntity): Promise<ProductEntity>;
}

export const IPRODUCTS_REPOSITORY = 'IPRODUCTS_REPOSITORY';
