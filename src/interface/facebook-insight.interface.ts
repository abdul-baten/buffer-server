import { I_INS_CHART } from './insight.interface';

// tslint:disable-next-line
export interface I_FB_INS_PAYLOAD {
  connectionId: string;
  since: string;
  until: string;
}

// tslint:disable-next-line
export interface I_INS_FB_POST_ITEM {
  attachment: string;
  createdTime: number;
  hashTags: string[];
  id: string;
  status: string;
  totalComments: number;
  totalLikes: number;
  totalReactions: number;
  totalShares: number;
  url: string;
  insights: [
    {
      engagedFan: number;
      engagedUsers: number;
      negativeFeedback: number;
      postClicks: number;
      postImpressions: number;
      postImpressionsOrganic: number;
      postImpressionsPaid: number;
      postReach: number;
    },
  ];
}

// tslint:disable-next-line
export interface I_INS_POSTS {
  tableData: I_INS_FB_POST_ITEM[];
}

// tslint:disable-next-line
export interface I_INS_POST extends I_INS_POSTS {
  engagedFan: number[];
  engagedUsers: number[];
  hashTags: number;
  postClicks: number[];
  postImpressions: number[];
  postReach: number[];
  posts: I_INS_CHART;
  totalComments: number[];
  totalLikes: number[];
  totalReactions: number[];
  totalShares: number[];
}

// tslint:disable-next-line
export interface I_INS_PAGE {
  page_call_phone_clicks_logged_in_unique: I_INS_CHART;
  page_engaged_users: I_INS_CHART;
  page_fan_adds: I_INS_CHART;
  page_fan_removes: I_INS_CHART;
  page_get_directions_clicks_logged_in_unique: I_INS_CHART;
  page_impressions: I_INS_CHART;
  page_impressions_unique: I_INS_CHART;
  page_tab_views_login_top: I_INS_CHART;
  page_total_actions: I_INS_CHART;
  page_video_complete_views_30s: I_INS_CHART;
  page_video_complete_views_30s_autoplayed: I_INS_CHART;
  page_video_complete_views_30s_click_to_play: I_INS_CHART;
  page_video_complete_views_30s_organic: I_INS_CHART;
  page_video_complete_views_30s_paid: I_INS_CHART;
  page_video_complete_views_30s_repeat_views: I_INS_CHART;
  page_video_complete_views_30s_unique: I_INS_CHART;
  page_video_repeat_views: I_INS_CHART;
  page_video_views: I_INS_CHART;
  page_video_views_10s: I_INS_CHART;
  page_video_views_10s_autoplayed: I_INS_CHART;
  page_video_views_10s_click_to_play: I_INS_CHART;
  page_video_views_10s_organic: I_INS_CHART;
  page_video_views_10s_paid: I_INS_CHART;
  page_video_views_10s_repeat: I_INS_CHART;
  page_video_views_10s_unique: I_INS_CHART;
  page_video_views_autoplayed: I_INS_CHART;
  page_video_views_click_to_play: I_INS_CHART;
  page_video_views_organic: I_INS_CHART;
  page_video_views_paid: I_INS_CHART;
  page_video_views_unique: I_INS_CHART;
  page_website_clicks_logged_in_unique: I_INS_CHART;

  page_views_total: I_INS_CHART;
  page_views_logout: I_INS_CHART;
  page_views_logged_in_total: I_INS_CHART;

  page_actions_post_reactions_like_total: I_INS_CHART;
  page_actions_post_reactions_love_total: I_INS_CHART;
  page_actions_post_reactions_wow_total: I_INS_CHART;
  page_actions_post_reactions_haha_total: I_INS_CHART;
  page_actions_post_reactions_sorry_total: I_INS_CHART;
  page_actions_post_reactions_anger_total: I_INS_CHART;
  page_actions_post_reactions_total: I_INS_CHART;
}

// tslint:disable-next-line
export interface I_INS_FB extends I_INS_PAGE {
  categories?: string[];
  id: string;
  postData: I_INS_POST;
}
