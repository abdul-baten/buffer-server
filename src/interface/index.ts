import { I_CONNECTION } from './connection.interface';
import { I_ERR, I_ERROR } from './error.interface';
import { I_FB_AUTH_ERROR, I_FB_AUTH_RESPONSE, I_FB_STATUS_SUCCESS } from './facebook.interface';
import { I_FB_GROUP, I_FB_PAGE } from './facebook-post.model';
import { I_FB_INS_PAYLOAD, I_INS_FB, I_INS_FB_POST_ITEM, I_INS_PAGE, I_INS_POST, I_INS_POSTS } from './facebook-insight.interface';
import { I_FB_PAGE_RESPONSE } from './social-profile.interface';
import { I_INS_CHART, I_INS_TOTAL, I_INSIGHT } from './insight.interface';
import { I_INS_IG, I_INS_IG_MEDIA, I_INS_IG_OVERVIEW } from './instagram-insight.interface';
import { I_LN_ACCESS_TOKEN_RESPONSE, I_LN_SUCCESS_RESPONSE } from './linkedin.interface';
import { I_MEDIA } from './media.interface';
import { I_POST } from './post.interface';
import { I_SUBSCRIPTION_PLAN, I_USER } from './user.interface';
import { I_TW_ACCESS_TOKEN_RESPONSE, I_TW_ERROR_RESPONSE, I_TW_MEDIA_UPLOAD_RESPONSE } from './twitter.interface';

export {
  I_CONNECTION,
  I_ERR,
  I_ERROR,
  I_FB_AUTH_ERROR,
  I_FB_AUTH_RESPONSE,
  I_FB_GROUP,
  I_FB_INS_PAYLOAD,
  I_FB_PAGE,
  I_FB_PAGE_RESPONSE,
  I_FB_STATUS_SUCCESS,
  I_INSIGHT,
  I_INS_CHART,
  I_INS_FB,
  I_INS_FB_POST_ITEM,
  I_INS_IG,
  I_INS_IG_MEDIA,
  I_INS_IG_OVERVIEW,
  I_INS_PAGE,
  I_INS_POST,
  I_INS_POSTS,
  I_INS_TOTAL,
  I_LN_ACCESS_TOKEN_RESPONSE,
  I_LN_SUCCESS_RESPONSE,
  I_MEDIA,
  I_POST,
  I_SUBSCRIPTION_PLAN,
  I_TW_ACCESS_TOKEN_RESPONSE,
  I_TW_ERROR_RESPONSE,
  I_TW_MEDIA_UPLOAD_RESPONSE,
  I_USER,
};
