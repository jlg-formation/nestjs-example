import { Test, TestingModule } from '@nestjs/testing';
import { RechargeController } from './recharge.controller';
import { RechargeService } from './recharge.service';
import { CreateRechargeDto } from './dto/create-recharge.dto';
import { ClientDto } from './dto/client.dto';

describe('RechargeController', () => {
  let controller: RechargeController;
  let rechargeService: Pick<RechargeService, 'recharge'>;
  let rechargeMock: jest.Mock<Promise<ClientDto>, [CreateRechargeDto]>;

  beforeEach(async () => {
    rechargeMock = jest.fn<Promise<ClientDto>, [CreateRechargeDto]>();
    rechargeService = {
      recharge: rechargeMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RechargeController],
      providers: [{ provide: RechargeService, useValue: rechargeService }],
    }).compile();

    controller = module.get<RechargeController>(RechargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('recharge', () => {
    it('should call service and return client', async () => {
      // Arrange
      const dto: CreateRechargeDto = { clientId: 'abc', amount: 100 };
      const client: ClientDto = { id: 'abc', name: 'Alice', balance: 200 };

      rechargeMock.mockResolvedValue(client);

      // Act
      const result = await controller.recharge(dto);

      // Assert
      expect(rechargeService.recharge).toHaveBeenCalledTimes(1);
      expect(rechargeService.recharge).toHaveBeenCalledWith(dto);
      expect(result).toEqual(client);
    });
  });
});
