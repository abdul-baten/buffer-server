import { LinkedInController } from './linkedin.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('LinkedInController', () => {
  let controller: LinkedInController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkedInController],
    }).compile();

    controller = module.get<LinkedInController>(LinkedInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
