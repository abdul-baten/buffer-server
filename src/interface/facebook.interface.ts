import type { EPostStatus } from '@enums';
import type { IPost } from './post.interface';

export interface IFbAuthResponse {
  access_token: string;
  bearer: string;
}

export interface IFbResponse {
  data: string | Record<string, unknown>;
}

export interface IFbAuthError {
  code: number;
  error_subcode: number;
  error_user_msg?: string;
  error_user_title?: string;
  fbtrace_id: string;
  message: string;
  type: string;
}

export interface IFbPostPayload{
  connection_id: string;
  connection_token: string;
  post_date_time?: string;
  post_message?: string;
  post_info?: IPost;
  post_status?: EPostStatus;
}
