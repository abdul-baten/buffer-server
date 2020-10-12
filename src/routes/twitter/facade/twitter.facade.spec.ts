import { TwitterFacade } from './twitter.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('Twitter Facade', () => {
  let service: TwitterFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitterFacade]
    }).compile();

    service = module.get<TwitterFacade>(TwitterFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
