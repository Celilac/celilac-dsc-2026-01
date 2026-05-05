import { Injectable } from "@nestjs/common";
import { OrderEntity } from "../entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { OrdersRepository } from "./orders.repository.interface";
import { Repository } from "typeorm";

@Injectable()
export class OrdersTypeORMRepository implements OrdersRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly repository: Repository<OrderEntity>,
    ) { }

    async findById(orderId: string): Promise<OrderEntity | null> {
        return this.repository.findOne({
            where: { orderId },
        });
    }

    async save(order: OrderEntity): Promise<OrderEntity> {
        return this.repository.save(order);
    }
}