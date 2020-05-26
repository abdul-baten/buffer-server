import * as rateLimit from 'express-rate-limit';
import { INestApplication } from '@nestjs/common';

const rateLimitMiddleware = (app: INestApplication) => {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
};

export default rateLimitMiddleware;
