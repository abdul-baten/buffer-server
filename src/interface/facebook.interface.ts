export interface I_FB_AUTH_RESPONSE {
  access_token: string;
  bearer: string;
}

export interface I_FB_STATUS_SUCCESS {
  data: string | Record<string, any>;
}

export interface I_FB_AUTH_ERROR {
  code: number;
  error_subcode: number;
  error_user_msg?: string;
  error_user_title?: string;
  fbtrace_id: string;
  message: string;
  type: string;
}
