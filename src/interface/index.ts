import { I_CONNECTION } from './connection.interface';
import { I_FB_AUTH_ERROR, I_FB_AUTH_RESPONSE } from './social-auth.interface';
import { I_FB_PAGE_RESPONSE } from './social-profile.interface';
import { I_SUBSCRIPTION_PLAN, I_USER } from './user.interface';
import { IError } from './error.interface';
import { IFBPage } from './facebook-post.model';
import { IPost, IPostConnection, IPostMedia } from './post.interface';

export {
  IError,
  IFBPage,
  IPost,
  IPostConnection,
  IPostMedia,
  I_FB_AUTH_ERROR,
  I_FB_AUTH_RESPONSE,
  I_FB_PAGE_RESPONSE,
  I_CONNECTION,
  I_SUBSCRIPTION_PLAN,
  I_USER,
};
