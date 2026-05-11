import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductStatusEnum } from '../../../common/products/enums/product-status.enum';
import { ProductsController } from './products.controller';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockCreateProductDto: CreateProductDto = {
    name: 'Bolo sem glúten',
    description: 'Bolo artesanal sem glúten',
    price: 25.90,
    partnerId: 'partner-001',
  };

  const mockProductEntity = {
    productId: 'generated-id',
    ...mockCreateProductDto,
    status: ProductStatusEnum.AVAILABLE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockProductsService = {
    create: jest.fn().mockResolvedValue(mockProductEntity),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a valid product', async () => {
      const result = await controller.create(mockCreateProductDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateProductDto);
      expect(result).toEqual(mockProductEntity);
    });
  });
});
