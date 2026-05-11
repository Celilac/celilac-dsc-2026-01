import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductStatusEnum } from '../../../common/products/enums/product-status.enum';
import { IPRODUCTS_REPOSITORY } from '../repositories/products.repository.interface';
import type { IProductsRepository } from '../repositories/products.repository.interface';
import { ProductEntity } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: IProductsRepository;

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
          provide: IPRODUCTS_REPOSITORY,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<IProductsRepository>(IPRODUCTS_REPOSITORY);
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
