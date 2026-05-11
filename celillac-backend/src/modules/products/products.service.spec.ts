import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

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
      const result = await service.create({
        name: 'Bolo sem glúten',
        description: 'Bolo artesanal sem glúten',
        price: 25.90,
        partnerId: 'partner-001',
      });

      expect(result).toEqual(
        expect.objectContaining({
          name: 'Bolo sem glúten',
          description: 'Bolo artesanal sem glúten',
          price: 25.90,
          partnerId: 'partner-001',
          status: 'available',
        }),
      );

      expect(result.productId).toBeDefined();
      expect(typeof result.productId).toBe('string');
      expect(typeof result.price).toBe('number');
      expect(result.price).toBe(25.90);
    });
  });
});
