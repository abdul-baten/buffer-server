import { E_APP_ENVIRONMENT } from '@app/enum';
import { EnvValidationUtil } from '@app/util/env-validation/env-validation.util';
import { join } from 'path';

const config = {
  APP: {
    ENVIRONMENT: E_APP_ENVIRONMENT.DEVELOPMENT,
    PORT: parseInt(process.env.PORT as string, 10) || 3000,
    API_PREFIX: '/api/v1.0.0',
    CLIENT_UNAUTH_REDIRECT_URL: 'https://localhost:5000/enter',
  },
  LOGGING: {
    LABEL: E_APP_ENVIRONMENT.DEVELOPMENT,
    LEVEL: 'debug',
    MORGAN_FORMAT: 'combined',
  },
  SESSION: {
    ALGORITHM: 'RS256', // RS256
    AUDIENCE: 'https://buffer.com/',
    ENCRYPTION_KEY: '{;<D.N8GzTJ)5egTW]GWx,MU%f4h&tr,', // length must be 16
    EXPIRATION: '1h', // in minute
    ISSUER: 'buffer',
    SECRET: '&2MSBWET(bsHnz%KDyF4A9(xwQn%}9=W',
    SUBJECT: 'buffer@accounts',
    CRYPTO_KEY: '?SP7qVnYQ68E;@HaZFpm23#8"{zj;$6Z',
    PRIVATE_KEY: join(process.cwd(), 'src/cert', 'private.pem'),
    PUBLIC_KEY: join(process.cwd(), 'src/cert', 'public.pem'),
  },
  DATABASE: {
    ADAPTAR_URI: process.env.DATABASE_ADAPTAR_URI,
    ADAPTAR_PASSWORD: process.env.DATABASE_ADAPTAR_PASSWORD,
  },
  SOCIAL_PLATFORM: {
    FACEBOOK: {
      CLIENT_ID: '466314977585281',
      CLIENT_SECRET: '8628ebbe08dab12d34b5860df4336037',
      SCOPE:
        'manage_pages, pages_show_list, read_insights, publish_video, publish_pages, public_profile',
      REDIRECT_URL: 'https://localhost:5000/connection/facebook-page',
    },
  },
};

EnvValidationUtil.validate(config);

export default config;

// DATABASE_ADAPTAR_TYPE="mongodb" DATABASE_ADAPTAR_URI="mongodb+srv://baten:<password>@cluster0-vqjwy.mongodb.net/test?retryWrites=true&w=majority" DATABASE_ADAPTAR_PASSWORD="baten@CAT2018" nodemon
