import { Test } from "@nestjs/testing";
import { ORDERS_REPOSITORY } from "../repositories/orders.repository.interface";
import type { OrdersRepository } from "../repositories/orders.repository.interface";
import { OrdersService } from "./orders.service";
import { OrderNotFoundException } from "../../../common/orders/exceptions/order-not-found.exception";
import { OrderAlreadyConfirmedException } from "../../../common/orders/exceptions/order-already-confirmed-exception";
import { OrderStatusEnum } from "../../../common/orders/enums/order-status.enum";
import type { PaymentsRepository } from "../../../modules/payments/repositories/payments.repository.interface";
import { PAYMENTS_REPOSITORY } from "../../../modules/payments/repositories/payments.repository.interface";
import { PaymentNotFoundException } from "../../../common/payments/exceptions/payment-not-found.exception";
import { PaymentNotApprovedException } from "../../../common/payments/exceptions/payment-not-approved.exception";
import { PaymentStatusEnum } from "../../../common/payments/enums/payment-status.enum";

describe('OrdersService', () => {
    let ordersService: OrdersService;
    let ordersRepository: jest.Mocked<OrdersRepository>;
    let paymentsRepository: jest.Mocked<PaymentsRepository>;

    beforeEach(async () => {
        const ordersRepositoryMock: OrdersRepository = {
            findById: jest.fn(),
            save: jest.fn(),
        }

        const paymentsRepositoryMock: PaymentsRepository = {
            findByOrderId: jest.fn(),
        }

        const module = await Test.createTestingModule({
            providers: [
                OrdersService,
                {
                    provide: ORDERS_REPOSITORY,
                    useValue: ordersRepositoryMock
                },
                {
                    provide: PAYMENTS_REPOSITORY,
                    useValue: paymentsRepositoryMock
                }],
        }).compile();

        ordersService = module.get(OrdersService);
        ordersRepository = module.get(ORDERS_REPOSITORY);
        paymentsRepository = module.get(PAYMENTS_REPOSITORY);
    })

    it('should fail when order does not exist', async () => {
        ordersRepository.findById.mockResolvedValue(null);

        await expect(ordersService.confirmOrder('1')).rejects.toThrow(OrderNotFoundException);
        expect(paymentsRepository.findByOrderId).not.toHaveBeenCalled();
        expect(ordersRepository.save).not.toHaveBeenCalled();
    })

    it('should fail when order is already confirmed', async () => {
        const order = { orderId: '1', status: OrderStatusEnum.CONFIRMED } as any;
        ordersRepository.findById.mockResolvedValue(order);

        await expect(ordersService.confirmOrder('1')).rejects.toThrow(OrderAlreadyConfirmedException);
        expect(paymentsRepository.findByOrderId).not.toHaveBeenCalled();
        expect(ordersRepository.save).not.toHaveBeenCalled();
    })

    it('should fail when payment does not exist', async () => {
        const order = { orderId: '1', status: OrderStatusEnum.PENDING } as any;
        ordersRepository.findById.mockResolvedValue(order);
        paymentsRepository.findByOrderId.mockResolvedValue(null);

        await expect(ordersService.confirmOrder('1')).rejects.toThrow(PaymentNotFoundException);
        expect(ordersRepository.save).not.toHaveBeenCalled();
    })

    it('should fail when payment is not approved', async () => {
        const order = { orderId: '1', status: OrderStatusEnum.PENDING } as any;
        ordersRepository.findById.mockResolvedValue(order);
        paymentsRepository.findByOrderId.mockResolvedValue({ status: PaymentStatusEnum.REJECTED } as any);

        await expect(ordersService.confirmOrder('1')).rejects.toThrow(PaymentNotApprovedException);
        expect(ordersRepository.save).not.toHaveBeenCalled();
    })

    it('should confirm order when everything is valid', async () => {
        const order = { orderId: '1', status: OrderStatusEnum.PENDING } as any;
        const payment = { status: PaymentStatusEnum.APPROVED } as any;
        const savedOrder = { ...order, status: OrderStatusEnum.CONFIRMED };

        ordersRepository.findById.mockResolvedValue(order);
        paymentsRepository.findByOrderId.mockResolvedValue(payment);
        ordersRepository.save.mockResolvedValue(savedOrder);

        const result = await ordersService.confirmOrder('1');

        expect(result).toEqual({
            orderId: '1',
            orderStatus: OrderStatusEnum.CONFIRMED
        });
        expect(order.status).toBe(OrderStatusEnum.CONFIRMED);
        expect(order.updatedAt).toBeInstanceOf(Date);
        expect(ordersRepository.save).toHaveBeenCalledWith(order);
    })
})