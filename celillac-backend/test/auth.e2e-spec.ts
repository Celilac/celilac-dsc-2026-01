import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserRoleEnum } from './../src/common/users/enums/user-role.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './../src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<UserEntity>;
  let testUser: UserEntity;

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

    userRepo = moduleFixture.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    
    // Clear user repository to ensure a clean state
    await userRepo.clear();

    // Create a user via the registration endpoint to simulate a real end-to-end flow
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Auth Test User',
        email: 'auth.test@example.com',
        password: 'authPassword123',
        role: UserRoleEnum.USER,
      });
      
    testUser = response.body;
  });

  afterAll(async () => {
    await userRepo.clear();
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should authenticate successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'auth.test@example.com', password: 'authPassword123' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(testUser.email);
          expect(res.body.user.role).toBe(testUser.role);
        });
    });

    it('should fail to authenticate with incorrect password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'auth.test@example.com', password: 'wrongPassword' })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Credenciais inválidas.');
        });
    });

    it('should fail to authenticate with a non-existent email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'non.existent@example.com', password: 'password123' })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Credenciais inválidas.');
        });
    });

    it('should reject requests with missing email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'password123' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email must be an email');
        });
    });

    it('should reject requests with missing password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'auth.test@example.com' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('password should not be empty');
        });
    });
  });

  describe('/auth/logout (POST)', () => {
    let accessToken: string;

    beforeAll(async () => {
      // Authenticate to get a token
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'auth.test@example.com', password: 'authPassword123' });
      accessToken = res.body.accessToken;
    });

    it('should log out successfully with a valid token', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Logout realizado com sucesso.');
        });
    });

    it('should deny access if no token is provided', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);
    });

    it('should deny access if an invalid token is provided', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalid.token.value')
        .expect(401);
    });
  });
});
