export interface ITwitterTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  screen_name: string;
  user_id: string;
}

export interface ITwitterMediaResponse {
  expires_after_secs?: number;
  image?: { image_type: string; w: number; h: number };
  media_id: number;
  media_id_string: string;
  size?: number;
  video?: { video_type: string };
}

export interface ITwitterErrorResponse {
  code: number;
  message: string;
}
