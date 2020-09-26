import { I_INS_CHART } from './insight.interface';

// tslint:disable-next-line
export interface I_INS_IG_MEDIA {
  caption: string;
  comments_count: number;
  createdTime: string;
  impressions: I_INS_CHART;
  like_count: number;
  media_type: string;
  media_url: string;
  permalink: string;
  reach: I_INS_CHART;
  saved: I_INS_CHART;
}

// tslint:disable-next-line
export interface I_INS_IG_OVERVIEW {
  follower_count: I_INS_CHART;
  impressions: I_INS_CHART;
  phone_call_clicks: I_INS_CHART;
  profile_views: I_INS_CHART;
  reach: I_INS_CHART;
  text_message_clicks: I_INS_CHART;
  website_clicks: I_INS_CHART;
}

// tslint:disable-next-line
export interface I_INS_IG extends I_INS_IG_OVERVIEW {
  categories?: string[];
  followers_count: number;
  follows_count: number;
  id: string;
  mediaData: I_INS_IG_MEDIA[];
  media_count: number;
  medias: I_INS_CHART;
}
