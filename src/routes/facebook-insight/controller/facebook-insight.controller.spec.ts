import { FacebookInsightController } from './facebook-insight.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('Facebook Insight Controller', () => {
  let controller: FacebookInsightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacebookInsightController]
    }).compile();

    controller = module.get<FacebookInsightController>(FacebookInsightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
