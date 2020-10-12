import { InstagramFacade } from './instagram.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('Instagram Facade', () => {
  let service: InstagramFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramFacade]
    }).compile();

    service = module.get<InstagramFacade>(InstagramFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
