export interface I_TW_ACCESS_TOKEN_RESPONSE {
  oauth_token: string;
  oauth_token_secret: string;
  screen_name: string;
  user_id: string;
}

export interface I_TW_MEDIA_UPLOAD_RESPONSE {
  media_id: number;
  media_id_string: string;
  size?: number;
  expires_after_secs?: number;
  image?: { image_type: string; w: number; h: number };
  video?: { video_type: string };
}

export interface I_TW_ERROR_RESPONSE {
  code: number;
  message: string;
}
