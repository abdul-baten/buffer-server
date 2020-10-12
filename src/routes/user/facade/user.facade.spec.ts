import { Test, TestingModule } from '@nestjs/testing';
import { UserFacade } from './user.facade';

describe('User Facade', () => {
  let service: UserFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFacade]
    }).compile();

    service = module.get<UserFacade>(UserFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
