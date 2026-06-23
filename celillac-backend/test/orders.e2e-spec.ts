import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserRoleEnum } from './../src/common/users/enums/user-role.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './../src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('Orders & Auth (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<UserEntity>;
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    userRepo = moduleFixture.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    // Clear user repository to avoid collisions
    await userRepo.clear();

    // Create a regular user
    const userPayload = {
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: UserRoleEnum.USER,
    };
    await request(app.getHttpServer())
      .post('/users')
      .send(userPayload)
      .expect(201);

    // Create an admin user
    const adminPayload = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: UserRoleEnum.ADMIN,
    };
    await request(app.getHttpServer())
      .post('/users')
      .send(adminPayload)
      .expect(201);

    // Authenticate user
    const userLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })
      .expect(200);
    userToken = userLoginRes.body.accessToken;

    // Authenticate admin
    const adminLoginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' })
      .expect(200);
    adminToken = adminLoginRes.body.accessToken;
  });

  afterAll(async () => {
    await userRepo.clear();
    await app.close();
  });

  describe('POST /orders/:id/confirm', () => {
    const dummyOrderId = '77777777-7777-7777-7777-777777777777';

    it('should deny confirmation if no token is provided (Authentication check)', () => {
      return request(app.getHttpServer())
        .post(`/orders/${dummyOrderId}/confirm`)
        .expect(401);
    });

    it('should deny confirmation if user role is USER (Authorization check)', () => {
      return request(app.getHttpServer())
        .post(`/orders/${dummyOrderId}/confirm`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should pass guards and reach the service (which returns 404 Not Found since order does not exist) when role is ADMIN', () => {
      return request(app.getHttpServer())
        .post(`/orders/${dummyOrderId}/confirm`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Pedido não encontrado.');
        });
    });
  });
});
