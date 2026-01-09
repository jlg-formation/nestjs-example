import { Test, TestingModule } from '@nestjs/testing';
import { SoldesController } from './soldes.controller';
import { SoldesService } from './soldes.service';

describe('SoldesController', () => {
  let controller: SoldesController;
  let soldesService: { ping: jest.Mock; recharge: jest.Mock };

  beforeEach(async () => {
    soldesService = {
      ping: jest.fn(() => ({ ok: true })),
      recharge: jest.fn(async (_clientId: string, _amount: number) => ({
        ok: true,
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoldesController],
      providers: [{ provide: SoldesService, useValue: soldesService }],
    }).compile();

    controller = module.get<SoldesController>(SoldesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ping', () => {
    it('should return { ok: true }', () => {
      expect(controller.ping()).toEqual({ ok: true });
      expect(soldesService.ping).toHaveBeenCalledTimes(1);
    });
  });

  describe('recharge', () => {
    it('should return ok + amount from body', () => {
      expect(
        controller.recharge({ clientId: 'abc', amount: 100 }),
      ).resolves.toEqual({
        ok: true,
      });

      expect(soldesService.recharge).toHaveBeenCalledTimes(1);
      expect(soldesService.recharge).toHaveBeenCalledWith('abc', 100);
    });
  });
});
