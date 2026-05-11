import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductsRepository {
  /**
   * Simulates persisting a product.
   */
  async save(product: ProductEntity): Promise<ProductEntity> {
    // Simulando persistência. Retorna a entidade como estivesse salva.
    return product;
  }
}
