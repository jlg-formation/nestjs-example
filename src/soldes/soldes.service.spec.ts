import { Test, TestingModule } from '@nestjs/testing';
import { SoldesService } from './soldes.service';

describe('SoldesService', () => {
  let service: SoldesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoldesService],
    }).compile();

    service = module.get<SoldesService>(SoldesService);
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
    it('should return ok + amount', () => {
      expect(service.recharge(100)).toEqual({ ok: true, amount: 100 });
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
});
