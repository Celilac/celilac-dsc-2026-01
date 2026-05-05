import { OrderStatusEnum } from "src/common/orders/enums/order-status.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('orders')
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid',
        { name: 'order_id' })
    orderId: string;

    @Column({ name: 'customer_id' })
    customerId: string;

    @Column({
        type: 'enum',
        enum: OrderStatusEnum,
        default: OrderStatusEnum.PENDING,
    })
    status: OrderStatusEnum;

    @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;
}