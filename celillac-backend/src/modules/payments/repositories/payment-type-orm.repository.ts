import { Injectable } from "@nestjs/common";
import { PaymentsRepository } from "./payments.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "../entities/payment.entity";
import { Repository } from "typeorm";

@Injectable()
export class PaymentsTypeORMRepository implements PaymentsRepository {
    constructor(
        @InjectRepository(PaymentEntity)
        private readonly repository: Repository<PaymentEntity>,
    ) { }

    async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
        return this.repository.findOne({
            where: { orderId },
        });
    }
}