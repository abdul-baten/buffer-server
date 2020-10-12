import { InstagramService } from './instagram.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Instagram Service', () => {
  let service: InstagramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramService]
    }).compile();

    service = module.get<InstagramService>(InstagramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
