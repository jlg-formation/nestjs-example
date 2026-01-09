import { NotFoundException } from '@nestjs/common';
import { RechargeService } from './recharge.service';
import type { RechargeRepository } from './recharge.repository';

describe('RechargeService', () => {
  describe('recharge', () => {
    it('should throw NotFoundException when client does not exist', async () => {
      const rechargeRepo: Pick<RechargeRepository, 'applyRecharge'> = {
        applyRecharge: jest.fn().mockResolvedValue(null),
      };

      const service = new RechargeService(rechargeRepo as RechargeRepository);

      await expect(
        service.recharge({ clientId: 'missing', amount: 100 }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(rechargeRepo.applyRecharge).toHaveBeenCalledTimes(1);
      expect(rechargeRepo.applyRecharge).toHaveBeenCalledWith('missing', 100);
    });
  });
});
