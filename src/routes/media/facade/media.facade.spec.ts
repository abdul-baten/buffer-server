import { MediaFacade } from './media.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('MediaFacade', () => {
  let service: MediaFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaFacade],
    }).compile();

    service = module.get<MediaFacade>(MediaFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
