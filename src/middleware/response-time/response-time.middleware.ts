import * as responseTime from 'response-time';
import { INestApplication } from '@nestjs/common';

const responseTimeMiddleware = (app: INestApplication): void => {
  app.use(responseTime());
};

export default responseTimeMiddleware;
