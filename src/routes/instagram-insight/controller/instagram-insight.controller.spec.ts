import { InstagramInsightController } from './instagram-insight.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('InstagramI nsight Controller', () => {
  let controller: InstagramInsightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstagramInsightController]
    }).compile();

    controller = module.get<InstagramInsightController>(InstagramInsightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
