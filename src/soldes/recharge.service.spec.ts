import { NotFoundException } from '@nestjs/common';
import { RechargeService } from './recharge.service';
import type { ClientRepository } from './client.repository';
import type { RechargeRepository } from './recharge.repository';

describe('RechargeService', () => {
  describe('recharge', () => {
    it('should throw NotFoundException when client does not exist', async () => {
      const clientRepo: Pick<ClientRepository, 'findByIdWithBalance'> = {
        findByIdWithBalance: jest.fn().mockResolvedValue(null),
      };

      const rechargeRepo: Pick<
        RechargeRepository,
        'insertRecharge' | 'incrementBalance'
      > = {
        insertRecharge: jest.fn(),
        incrementBalance: jest.fn(),
      };

      const service = new RechargeService(
        clientRepo as ClientRepository,
        rechargeRepo as RechargeRepository,
      );

      await expect(
        service.recharge({ clientId: 'missing', amount: 100 }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(clientRepo.findByIdWithBalance).toHaveBeenCalledTimes(1);
      expect(clientRepo.findByIdWithBalance).toHaveBeenCalledWith('missing');
      expect(rechargeRepo.insertRecharge).not.toHaveBeenCalled();
      expect(rechargeRepo.incrementBalance).not.toHaveBeenCalled();
    });
  });
});
