import { EAppEnvironment } from '@enums';
import { EnvValidationUtil } from '@utils';
import { join } from 'path';

const config = {
  APP: {
    API_PREFIX: '/api/v1.0.0',
    CLIENT_UNAUTH_REDIRECT_URL: 'https://localhost:5000/enter',
    ENVIRONMENT: EAppEnvironment.DEVELOPMENT,
    LOG_DIR: join(process.cwd(), 'logs'),
    PORT: process.env.PORT,
    UPLOAD_DIR: join(process.cwd(), 'upload')
  },
  COOKIE: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    httpOnly: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    maxAge: process.env.EXPIRES_IN,
    path: '/',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    sameSite: true,
    secure: true
  },
  DATABASE: {
    ADAPTAR_PASSWORD: process.env.DATABASE_ADAPTAR_PASSWORD,
    ADAPTAR_URI: process.env.DATABASE_ADAPTAR_URI
  },
  LOGGING: {
    LABEL: EAppEnvironment.DEVELOPMENT,
    LEVEL: 'error'
  },
  SESSION: {
    ALGORITHM: 'RS256',
    AUDIENCE: 'https://buffer.com/',
    // CRYPTO_KEY Length must be 16
    CRYPTO_KEY: '?SP7qVnYQ68E;@HaZFpm23#8%{zj;$6Z',
    ENCRYPTION_KEY: '{;<D.N8GzTJ)5egTW]GWx,MU%f4h&tr,',
    EXPIRATION: process.env.EXPIRES_IN,
    ISSUER: 'buffer',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
    PRIVATE_KEY: join(process.cwd(), 'src/cert', 'private.pem'),
    PUBLIC_KEY: join(process.cwd(), 'src/cert', 'public.pem'),
    SECRET: '&2MSBWET(bsHnz%KDyF4A9(xwQn%}9=W',
    SUBJECT: 'buffer@accounts'
  },
  SOCIAL_PLATFORM: {
    FACEBOOK: {
      CLIENT_ID: '466314977585281',
      CLIENT_SECRET: '8628ebbe08dab12d34b5860df4336037',
      GRAPH_API: 'https://graph.facebook.com',
      GROUP_API: 'https://graph.facebook.com/me/groups',
      GROUP_PARAMS: 'picture{url},name,id,privacy',
      IG_PARAMS: 'accounts{instagram_business_account{id,username,profile_picture_url}}',
      PAGE_API: 'https://graph.facebook.com/me/accounts',
      PAGE_PARAMS: 'picture{url},name,category,id,access_token',
      SCOPE: `read_insights, publish_video, pages_show_list, ads_read, business_management,
        publish_to_groups, groups_access_member_info, pages_read_engagement, pages_manage_metadata,
        pages_read_user_content, pages_manage_ads, pages_manage_posts, pages_manage_engagement, public_profile,
        instagram_basic, instagram_manage_comments, instagram_manage_insights`,
      VIDEO_GRAPH_API: 'https://graph-video.facebook.com'
    },
    IG: {
      API_ID: '616272269252720',
      API_SECRET: '563bc6154eb240e3851692b55bcf132a'
    },
    LINKEDIN: {
      CLIENT_ID: '865bt9hwrq8jph',
      CLIENT_SECRET: 'qqNmcP3C8gLdJiSz',
      ORG_API: 'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee',
      SCOPE: [
        'r_emailaddress',
        'r_ads',
        'w_organization_social',
        'rw_ads',
        'r_basicprofile',
        'r_liteprofile',
        'r_ads_reporting',
        'r_organization_social',
        'rw_organization_admin',
        'w_member_social',
        'r_1st_connections_size'
      ],
      UGC_API: 'https://api.linkedin.com/v2/ugcPosts'
    },
    REDIRECT_URL: 'https://localhost:5000/connection',
    TWITTER: {
      ACCESS_TOKEN: '1745715421-zzjN6aAFrKoTtcXucnN2MFAjj4Vz0e0eKERA8jz',
      ACCESS_TOKEN_SECRET: 'ABJq5z8xuxgM2UkT78h7TfOdEIoJ5wTFOjEGQu0EoaVmI',
      API_KEY: '3VeiDudVrGPgCEeoGoslExGyC',
      API_SECRET: 'CP4n2wM6Lmh3RVjwdXwbJR8IyXx7wwcV8mKMVILLjjrMCfn1Qy',
      GRAPH_API: 'https://api.twitter.com/1.1/statuses/update.json'
    }
  }
};

EnvValidationUtil.validate(config);

export default config;
