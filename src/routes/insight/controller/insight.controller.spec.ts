import { InsightController } from './insight.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('Insight Controller', () => {
  let controller: InsightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsightController]
    }).compile();

    controller = module.get<InsightController>(InsightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
