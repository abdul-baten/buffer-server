import { FacebookController } from './facebook.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('Facebook Controller', () => {
  let controller: FacebookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacebookController]
    }).compile();

    controller = module.get<FacebookController>(FacebookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
