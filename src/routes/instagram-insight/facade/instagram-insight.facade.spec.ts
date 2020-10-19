import { InstagramInsightFacade } from './instagram-insight.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('Instagram Insight Facade', () => {
  let service: InstagramInsightFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramInsightFacade]
    }).compile();

    service = module.get<InstagramInsightFacade>(InstagramInsightFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
