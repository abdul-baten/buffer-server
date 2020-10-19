import { FacebookInsightFacade } from './facebook-insight.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('Facebook Insight Facade', () => {
  let service: FacebookInsightFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacebookInsightFacade]
    }).compile();

    service = module.get<FacebookInsightFacade>(FacebookInsightFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
