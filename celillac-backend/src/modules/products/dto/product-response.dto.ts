import { ProductEntity } from '../entities/product.entity';
import { ProductStatusEnum } from '../../../common/products/enums/product-status.enum';

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  partnerId: string;
  status: ProductStatusEnum;

  static fromEntity(entity: ProductEntity): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = entity.productId;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.price = Number(entity.price);
    dto.partnerId = entity.partnerId;
    dto.status = entity.status;
    return dto;
  }
}
