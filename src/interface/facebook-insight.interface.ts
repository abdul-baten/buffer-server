import type { Document } from 'mongoose';
import type { IInsightChart } from './insight.interface';

export interface IFbInsightPayload {
  connection_id: string;
  since: string;
  until: string;
}

export interface IFbOverviewInsight extends Document {
  categories: string[];
  page_actions_post_reactions_anger_total: IInsightChart;
  page_actions_post_reactions_haha_total: IInsightChart;
  page_actions_post_reactions_like_total: IInsightChart;
  page_actions_post_reactions_love_total: IInsightChart;
  page_actions_post_reactions_sorry_total: IInsightChart;
  page_actions_post_reactions_total: IInsightChart;
  page_actions_post_reactions_wow_total: IInsightChart;
  page_engaged_users: IInsightChart;
  page_fan_adds: IInsightChart;
  page_fan_removes: IInsightChart;
  page_impressions: IInsightChart;
  page_impressions_unique: IInsightChart;
  page_views_total: IInsightChart;
}

export interface IFbPost {
  attachment: string;
  created_time: Date;
  hash_tags: string[];
  id: string;
  insights: [
    {
      engaged_fans: number;
      engaged_users: number;
      negative_feedbacks: number;
      post_clicks: number;
      post_impressions: number;
      post_impressions_organic: number;
      post_impressions_paid: number;
      post_reach: number;
    },
  ];
  status: string;
  total_comments: number;
  total_likes: number;
  total_reactions: number;
  total_shares: number;
  url: string;
}

export interface IFbPostInsight extends Document {
  categories: string[];
  engaged_fans: number[];
  engaged_users: number[];
  hash_tags: number;
  post_clicks: number[];
  post_impressions: number[];
  post_reach: number[];
  posts: IInsightChart;
  posts_table: IFbPost[];
  total_comments: number[];
  total_likes: number[];
  total_reactions: number[];
  total_shares: number[];
}

export interface IFbVideoInsight extends Document {
  categories: string[];
  page_video_complete_views_30s: IInsightChart;
  page_video_complete_views_30s_autoplayed: IInsightChart;
  page_video_complete_views_30s_click_to_play: IInsightChart;
  page_video_complete_views_30s_organic: IInsightChart;
  page_video_complete_views_30s_paid: IInsightChart;
  page_video_complete_views_30s_repeat_views: IInsightChart;
  page_video_complete_views_30s_unique: IInsightChart;
  page_video_repeat_views: IInsightChart;
  page_video_views: IInsightChart;
  page_video_views_10s: IInsightChart;
  page_video_views_10s_autoplayed: IInsightChart;
  page_video_views_10s_click_to_play: IInsightChart;
  page_video_views_10s_organic: IInsightChart;
  page_video_views_10s_paid: IInsightChart;
  page_video_views_10s_repeat: IInsightChart;
  page_video_views_10s_unique: IInsightChart;
  page_video_views_autoplayed: IInsightChart;
  page_video_views_click_to_play: IInsightChart;
  page_video_views_organic: IInsightChart;
  page_video_views_paid: IInsightChart;
  page_video_views_unique: IInsightChart;
}

export interface IFbPerformanceInsight extends Document {
  categories: string[];
  page_call_phone_clicks_logged_in_unique: IInsightChart;
  page_get_directions_clicks_logged_in_unique: IInsightChart;
  page_tab_views_login_top: IInsightChart;
  page_total_actions: IInsightChart;
  page_views_logged_in_total: IInsightChart;
  page_views_logout: IInsightChart;
  page_website_clicks_logged_in_unique: IInsightChart;
}
