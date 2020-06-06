export interface I_FB_AUTH_RESPONSE {
  access_token: string;
  bearer: string;
}

export interface I_FB_STATUS_SUCCESS {
  id: string;
}

export interface I_FB_AUTH_ERROR {
  message: string;
  type: string;
  code: number;
  error_subcode: number;
  fbtrace_id: string;
}
