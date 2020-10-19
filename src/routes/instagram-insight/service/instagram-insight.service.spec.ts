import { InstagramInsightService } from './instagram-insight.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Instagram Insight Service', () => {
  let service: InstagramInsightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramInsightService]
    }).compile();

    service = module.get<InstagramInsightService>(InstagramInsightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
