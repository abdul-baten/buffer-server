import * as statusMonitor from 'express-status-monitor';
import { INestApplication } from '@nestjs/common';

const appStatusMonitorMiddleware = (app: INestApplication): void => {
  app.use(
    statusMonitor({
      healthChecks: [],
      ignoreStartsWith: '/admin',
      path: '/checkStatus',
      title: 'Application Status',
    }),
  );
};

export default appStatusMonitorMiddleware;
