import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductStatusEnum } from '../../../common/products/enums/product-status.enum';
import { ProductsRepository } from '../repositories/products.repository';
import { ProductEntity } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  const mockCreateProductDto: CreateProductDto = {
    name: 'Bolo sem glúten',
    description: 'Bolo artesanal sem glúten',
    price: 25.90,
    partnerId: 'partner-001',
  };

  const mockProductsRepository = {
    save: jest.fn().mockImplementation((product: ProductEntity) => Promise.resolve(product)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
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
