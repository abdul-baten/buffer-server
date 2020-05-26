import * as methodOverride from 'method-override';
import { INestApplication } from '@nestjs/common';

const methodOverrideMiddleware = (app: INestApplication): void => {
  app.use(methodOverride('X-HTTP-Method'));
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.use(methodOverride('X-Method-Override'));
};

export default methodOverrideMiddleware;
