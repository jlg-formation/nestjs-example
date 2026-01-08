import { Test, TestingModule } from '@nestjs/testing';
import { SoldesController } from './soldes.controller';

describe('SoldesController', () => {
  let controller: SoldesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoldesController],
    }).compile();

    controller = module.get<SoldesController>(SoldesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ping', () => {
    it('should return { ok: true }', () => {
      expect(controller.ping()).toEqual({ ok: true });
    });
  });

  describe('recharge', () => {
    it('should return ok + amount from body', () => {
      expect(controller.recharge({ amount: 100 })).toEqual({
        ok: true,
        amount: 100,
      });
    });
  });
});
