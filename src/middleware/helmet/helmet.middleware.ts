import { INestApplication } from '@nestjs/common';
import {
  contentSecurityPolicy,
  expectCt,
  frameguard,
  hidePoweredBy,
  ieNoOpen,
  noCache,
  referrerPolicy,
} from 'helmet';

const helmetMiddleware = (app: INestApplication) => {
  app.use(
    contentSecurityPolicy({
      browserSniff: true,
      directives: {
        blockAllMixedContent: true,
        defaultSrc: ["'self'"],
        upgradeInsecureRequests: true,
      },
      disableAndroid: true,
      setAllHeaders: true,
    }),
  );
  app.use(
    expectCt({
      enforce: true,
      maxAge: 123,
    }),
  );
  app.use(frameguard({ action: 'deny' }));
  app.use(ieNoOpen());
  app.use(hidePoweredBy());
  app.use(noCache(true));
  app.use(referrerPolicy({ policy: 'same-origin' }));
};

export default helmetMiddleware;
