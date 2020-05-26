import * as errorHandler from 'errorhandler';
import { INestApplication } from '@nestjs/common';

const errorHandlerMiddleWare = (app: INestApplication): void => {
  if (process.env.NODE_ENV !== 'production') {
    app.use(errorHandler({ log: true }));
  }
};

export default errorHandlerMiddleWare;
