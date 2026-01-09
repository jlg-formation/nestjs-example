import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SoldesService } from './soldes.service';
import { RechargeRepository } from './recharge.repository';

describe('SoldesService', () => {
  let service: SoldesService;
  let config: ConfigService;
  let rechargeRepo: { applyRecharge: jest.Mock };

  beforeEach(async () => {
    rechargeRepo = {
      applyRecharge: jest.fn().mockResolvedValue({
        id: 'abc',
        name: 'Test',
        balance: 100,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoldesService,
        { provide: RechargeRepository, useValue: rechargeRepo },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SoldesService>(SoldesService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ping', () => {
    it('should return { ok: true }', () => {
      expect(service.ping()).toEqual({ ok: true });
    });
  });

  describe('recharge', () => {
    it('should return ok + amount', async () => {
      await expect(service.recharge('abc', 100)).resolves.toEqual({ ok: true });
    });

    it('should insert a recharge when client exists', async () => {
      await expect(service.recharge('abc', 100)).resolves.toEqual({ ok: true });
      expect(rechargeRepo.applyRecharge).toHaveBeenCalledWith('abc', 100);
    });
  });

  describe('getBalance', () => {
    it('should throw an error when clientId is invalid', () => {
      expect(() => service.getBalance(0)).toThrow('Invalid clientId');
      expect(() => service.getBalance(-1)).toThrow('Invalid clientId');
    });

    it('should return 0 when clientId is valid', () => {
      expect(service.getBalance(1)).toBe(0);
    });
  });

  describe('getDbHost', () => {
    it("should return 'localhost' when DB_HOST is missing", () => {
      jest
        .spyOn(config, 'get')
        .mockImplementation((key: string, defaultValue?: string) => {
          if (key === 'DB_HOST') return defaultValue;
          return defaultValue;
        });

      expect(service.getDbHost()).toBe('localhost');
    });
  });
});
