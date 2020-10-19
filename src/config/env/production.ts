import { EAppEnvironment } from '@enums';
import { EnvValidationUtil } from '@utils';
import { join } from 'path';

const config = {
  APP: {
    API_PREFIX: '/api/v1.0.0',
    CLIENT_UNAUTH_REDIRECT_URL: 'https://localhost:5000/enter',
    ENVIRONMENT: EAppEnvironment.PRODUCTION,
    PORT: Number.parseInt(process.env.PORT as string, 10),
    UPLOAD_DIR: join(process.cwd(), 'upload')
  },
  DATABASE: {
    ADAPTAR_PASSWORD: process.env.DATABASE_ADAPTAR_PASSWORD,
    ADAPTAR_URI: process.env.DATABASE_ADAPTAR_URI
  },
  LOGGING: {
    LABEL: EAppEnvironment.PRODUCTION,
    LEVEL: 'error',
    MORGAN_FORMAT: 'common'
  },
  SESSION: {
    ALGORITHM: 'RS256',
    AUDIENCE: 'https://meedbankingclub.com/',
    CRYPTO_KEY: '?SP7qVnYQ68E;@HaZFpm23#8"{zj;$6Z',
    ENCRYPTION_KEY: 'Df@pc]_p}1Th@RBcbuJ/A7"B+&[d2Pwu',
    EXPIRATION: '10m',
    ISSUER: 'buffer',
    SECRET: 'uB::n)4h118B>+-p$r*_2xyH25WCyEx&',
    SUBJECT: 'buffer@accounts'
  },
  SOCIAL_PLATFORM: {
    FACEBOOK: {
      CLIENT_ID: '466314977585281',
      CLIENT_SECRET: '8628ebbe08dab12d34b5860df4336037',
      REDIRECT_URL: 'https://localhost:5000/connection',
      SCOPE:
        `read_insights, publish_video, pages_show_list, ads_read, business_management, publish_to_groups, 
        groups_access_member_info, pages_read_engagement, pages_manage_metadata, pages_read_user_content,
      pages_manage_ads, pages_manage_posts, pages_manage_engagement, public_profile`
    }
  }
};

EnvValidationUtil.validate(config);

export default config;
