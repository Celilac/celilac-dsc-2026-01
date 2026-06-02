import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserRoleEnum } from './../src/common/users/enums/user-role.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './../src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('Users & Auth (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<UserEntity>;

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
    await userRepo.clear();
  });

  afterAll(async () => {
    // Clean up created users in test DB
    await userRepo.clear();
    await app.close();
  });

  describe('POST /users (Registration)', () => {
    it('should create a user successfully with valid data', () => {
      const payload = {
        name: 'Everton Test',
        email: 'everton.test@example.com',
        password: 'password123',
        role: UserRoleEnum.USER,
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('userId');
          expect(res.body.name).toBe(payload.name);
          expect(res.body.email).toBe(payload.email);
          expect(res.body.role).toBe(payload.role);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should reject registration if email is invalid', () => {
      const payload = {
        name: 'Invalid Email User',
        email: 'invalid-email-address',
        password: 'password123',
        role: UserRoleEnum.USER,
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email must be an email');
        });
    });

    it('should reject registration if role is empty or invalid', () => {
      const payload = {
        name: 'Invalid Role User',
        email: 'invalid.role@example.com',
        password: 'password123',
        role: '',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('role must be one of the following values: admin, user');
        });
    });

    it('should reject registration if password is too short', () => {
      const payload = {
        name: 'Short Password User',
        email: 'short.pass@example.com',
        password: '123',
        role: UserRoleEnum.USER,
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('password must be longer than or equal to 6 characters');
        });
    });
  });

  describe('POST /auth/login (Authentication)', () => {
    beforeAll(async () => {
      // Create an admin user for testing auth & roles
      const adminPayload = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminPassword123',
        role: UserRoleEnum.ADMIN,
      };
      await request(app.getHttpServer()).post('/users').send(adminPayload);
    });

    it('should authenticate successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'adminPassword123' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body.user.email).toBe('admin@example.com');
          expect(res.body.user.role).toBe(UserRoleEnum.ADMIN);
        });
    });

    it('should reject authentication with invalid password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'wrongPassword' })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid credentials.');
        });
    });
  });

  describe('POST /auth/logout (Logout)', () => {
    let token: string;

    beforeAll(async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'adminPassword123' });
      token = loginRes.body.accessToken;
    });

    it('should deny logout if no token is provided', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401);
    });

    it('should allow logout when valid token is provided', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Logout realizado com sucesso.');
        });
    });
  });

  describe('GET /users & Roles Guard (Authorization)', () => {
    let userToken: string;
    let adminToken: string;
    let createdUser: any;

    beforeAll(async () => {
      // Get tokens for ADMIN and USER
      const userLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'everton.test@example.com', password: 'password123' });
      userToken = userLogin.body.accessToken;
      createdUser = userLogin.body.user;

      const adminLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'adminPassword123' });
      adminToken = adminLogin.body.accessToken;
    });

    it('should deny listing all users without a token', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });

    it('should deny listing all users if user role is not ADMIN', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should allow listing all users if user role is ADMIN', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
        });
    });

    it('should allow getting a specific user by id', () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUser.userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.userId).toBe(createdUser.userId);
          expect(res.body.email).toBe(createdUser.email);
        });
    });

    it('should allow updating own profile details', () => {
      return request(app.getHttpServer())
        .put(`/users/${createdUser.userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Everton Updated' })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Everton Updated');
        });
    });

    it('should allow admin to soft delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${createdUser.userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verify that getting the user now throws 404
      await request(app.getHttpServer())
        .get(`/users/${createdUser.userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
