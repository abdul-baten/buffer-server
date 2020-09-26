import { InsightFacade } from './insight.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('InsightFacade', () => {
  let service: InsightFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsightFacade],
    }).compile();

    service = module.get<InsightFacade>(InsightFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
