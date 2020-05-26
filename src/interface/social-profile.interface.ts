import { I_USER } from './user.interface';
import { I_CONNECTION } from './connection.interface';

export interface I_FB_PAGE_RESPONSE {
  user: I_USER;
  pages: I_CONNECTION[];
}
