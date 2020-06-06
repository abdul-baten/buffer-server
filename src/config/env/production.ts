import { E_APP_ENVIRONMENT } from '@enums';
import { EnvValidationUtil } from '@utils';
import { join } from 'path';

const config = {
  APP: {
    ENVIRONMENT: E_APP_ENVIRONMENT.PRODUCTION,
    PORT: parseInt(process.env.PORT as string, 10) || 3000,
    API_PREFIX: '/api/v1.0.0',
    CLIENT_UNAUTH_REDIRECT_URL: 'https://localhost:5000/enter',
    UPLOAD_DIR: join(process.cwd(), 'upload'),
  },
  LOGGING: {
    LABEL: E_APP_ENVIRONMENT.PRODUCTION,
    LEVEL: 'error',
    MORGAN_FORMAT: 'common',
  },
  SESSION: {
    ALGORITHM: 'RS256', // RS256
    AUDIENCE: 'https://meedbankingclub.com/',
    ENCRYPTION_KEY: 'Df@pc]_p}1Th@RBcbuJ/A7"B+&[d2Pwu', // length must be 16
    EXPIRATION: '10m', // in minute
    ISSUER: 'buffer',
    SECRET: 'uB::n)4h118B>+-p$r*_2xyH25WCyEx&',
    SUBJECT: 'buffer@accounts',
    CRYPTO_KEY: '?SP7qVnYQ68E;@HaZFpm23#8"{zj;$6Z',
  },
  DATABASE: {
    ADAPTAR_URI: process.env.DATABASE_ADAPTAR_URI,
    ADAPTAR_PASSWORD: process.env.DATABASE_ADAPTAR_PASSWORD,
  },
  SOCIAL_PLATFORM: {
    FACEBOOK: {
      CLIENT_ID: '466314977585281',
      CLIENT_SECRET: '8628ebbe08dab12d34b5860df4336037',
      SCOPE: 'manage_pages, pages_show_list, read_insights, publish_video, publish_pages, public_profile',
      REDIRECT_URL: 'https://localhost:5000/oauth/facebook',
    },
  },
};

EnvValidationUtil.validate(config);

export default config;
