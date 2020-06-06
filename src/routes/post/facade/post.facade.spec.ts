import { PostFacade } from './post.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('PostFacade', () => {
  let service: PostFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostFacade],
    }).compile();

    service = module.get<PostFacade>(PostFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
