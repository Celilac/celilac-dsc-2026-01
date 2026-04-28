import { Test } from "@nestjs/testing";
import { ORDERS_REPOSITORY } from "../repositories/orders.repository.interface";
import type { OrdersRepository } from "../repositories/orders.repository.interface";
import { OrdersService } from "./orders.service";
import { OrderNotFoundException } from "../../../common/exceptions/order-not-found.exception";

describe('OrdersService', () => {
    let ordersService: OrdersService;
    let ordersRepository: jest.Mocked<OrdersRepository>;

    beforeEach(async () => {
        const ordersRepositoryMock: OrdersRepository = {
            findById: jest.fn(),
            save: jest.fn(),
        }

        const module = await Test.createTestingModule({
            providers: [OrdersService, {
                provide: ORDERS_REPOSITORY,
                useValue: ordersRepositoryMock
            }],
        }).compile();

        ordersService = module.get(OrdersService);
        ordersRepository = module.get(ORDERS_REPOSITORY);
    })

    it('should fail when order does not exist', async () => {
        ordersRepository.findById.mockResolvedValue(null);

        await expect(ordersService.confirmOrder('1')).rejects.toThrow(OrderNotFoundException);
    })
})