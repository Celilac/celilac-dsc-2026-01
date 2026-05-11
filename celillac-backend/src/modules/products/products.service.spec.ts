import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatusEnum } from '../../common/products/enums/product-status.enum';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockCreateProductDto: CreateProductDto = {
    name: 'Bolo sem glúten',
    description: 'Bolo artesanal sem glúten',
    price: 25.90,
    partnerId: 'partner-001',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a valid product', async () => {
      const result = await service.create(mockCreateProductDto);

      expect(result).toEqual(
        expect.objectContaining({
          ...mockCreateProductDto,
          status: ProductStatusEnum.AVAILABLE,
        }),
      );

      expect(result.productId).toBeDefined();
    });
  });
});
