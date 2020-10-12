import { ConnectionFacade } from './connection.facade';
import { Test, TestingModule } from '@nestjs/testing';

describe('Connection Facade', () => {
  let service: ConnectionFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionFacade]
    }).compile();

    service = module.get<ConnectionFacade>(ConnectionFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
