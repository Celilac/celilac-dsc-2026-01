import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService {
  async create(data: any) {
    return {
      ...data,
      productId: randomUUID(),
      status: 'available',
    };
  }
}
