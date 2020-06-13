import { LinkedInFacade } from './linkedin.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('LinkedInFacade', () => {
  let service: LinkedInFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkedInFacade],
    }).compile();

    service = module.get<LinkedInFacade>(LinkedInFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
