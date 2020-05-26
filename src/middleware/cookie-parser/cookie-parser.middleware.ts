import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';

const cookieParserMiddleware = (app: INestApplication) => {
  app.use(cookieParser());
};

export default cookieParserMiddleware;
