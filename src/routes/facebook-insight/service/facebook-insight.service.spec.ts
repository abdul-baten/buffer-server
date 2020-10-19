import { OverviewService } from './overview.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Facebook Overview Service', () => {
  let service: OverviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OverviewService]
    }).compile();

    service = module.get<OverviewService>(OverviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
