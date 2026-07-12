import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (POST) - should create a product and return public structure', () => {
    const createProductDto = {
      name: 'Bolo sem glúten',
      description: 'Bolo artesanal sem glúten',
      price: 25.9,
      partnerId: 'partner-001',
    };

    return request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).not.toHaveProperty('productId');
        expect(res.body).not.toHaveProperty('createdAt');
        expect(res.body).not.toHaveProperty('updatedAt');
        expect(res.body).not.toHaveProperty('deletedAt');
        expect(res.body.name).toBe(createProductDto.name);
        expect(res.body.description).toBe(createProductDto.description);
        expect(Number(res.body.price)).toBe(createProductDto.price);
        expect(res.body.partnerId).toBe(createProductDto.partnerId);
        expect(res.body.status).toBe('available');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
