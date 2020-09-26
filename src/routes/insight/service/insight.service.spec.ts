import { InsightService } from './insight.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('InsightService', () => {
  let service: InsightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsightService],
    }).compile();

    service = module.get<InsightService>(InsightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
