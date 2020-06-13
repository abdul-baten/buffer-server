import { FacebookFacade } from './facebook.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('FacebookFacade', () => {
  let service: FacebookFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacebookFacade],
    }).compile();

    service = module.get<FacebookFacade>(FacebookFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
