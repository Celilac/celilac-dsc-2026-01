import { OrderStatus } from "src/common/enums/order-status.enum";

export class Order {
    orderId: string;
    customerId: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}