import { ProductEntity } from '../entities/product.entity';
import { ProductStatusEnum } from '../../../common/products/enums/product-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'The unique identifier of the product',
  })
  id: string;

  @ApiProperty({
    example: 'Leite Integral Celilac',
    description: 'The name of the product',
  })
  name: string;

  @ApiProperty({
    example: 'Leite integral pasteurizado 1L',
    description: 'The detailed description of the product',
  })
  description: string;

  @ApiProperty({ example: 4.5, description: 'The price of the product' })
  price: number;

  @ApiProperty({
    example: 'partner-uuid-1234',
    description: 'The ID of the partner providing the product',
  })
  partnerId: string;

  @ApiProperty({
    enum: ProductStatusEnum,
    example: ProductStatusEnum.AVAILABLE,
    description: 'The status of the product',
  })
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
