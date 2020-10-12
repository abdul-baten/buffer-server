import { PostTaskService } from './post-task.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PostTask Service', () => {
  let service: PostTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostTaskService]
    }).compile();

    service = module.get<PostTaskService>(PostTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
