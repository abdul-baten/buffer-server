import { RequestLogInterceptor } from './request-log.interceptor';

describe('RequestLogInterceptor', () => {
  it('should be defined', () => {
    expect(new RequestLogInterceptor()).toBeDefined();
  });
});
