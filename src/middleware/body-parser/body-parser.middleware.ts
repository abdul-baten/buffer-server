import { INestApplication } from '@nestjs/common';
import { json, urlencoded } from 'body-parser';

const bodyParserMiddleware = (app: INestApplication): void => {
  app.use(json());
  app.use(urlencoded({ extended: true }));
};

export default bodyParserMiddleware;
