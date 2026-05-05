import { OrderEntity } from "../entities/order.entity";

export const ORDERS_REPOSITORY = 'ORDERS_REPOSITORY';

export interface OrdersRepository {
    findById(orderId: string): Promise<OrderEntity | null>;
    save(order: OrderEntity): Promise<OrderEntity>;
}