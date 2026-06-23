import { randomUUID } from 'crypto';
import { OrderStatusEnum } from '../../../common/orders/enums/order-status.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'order_id' })
  orderId: string = randomUUID();

  @Column({ name: 'customer_id' })
  customerId!: string;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status: OrderStatusEnum;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  constructor(partial?: Partial<OrderEntity>) {
    Object.assign(this, partial);

    // if (!this.orderId) {
    //     this.orderId = randomUUID();
    // }
    // if (!this.status) {
    //     this.status = OrderStatusEnum.PENDING;
    // }
    // if (!this.createdAt) {
    //     this.createdAt = new Date();
    // }
    // if (!this.updatedAt) {
    //     this.updatedAt = new Date();
    // }

    // this.orderId = randomUUID();
    // this.status = OrderStatusEnum.PENDING;
    // this.createdAt = new Date();
    // this.updatedAt = new Date();
  }
}
