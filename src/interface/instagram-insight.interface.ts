import type { IInsightChart } from './insight.interface';

export interface IInstaMediaInsight {
  caption: string;
  comments_count: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_time: string;
  impressions: IInsightChart;
  like_count: number;
  media_type: string;
  media_url: string;
  permalink: string;
  reach: IInsightChart;
  saved: IInsightChart;
}

export interface IInstaOverviewInsight {
  follower_count: IInsightChart;
  impressions: IInsightChart;
  phone_call_clicks: IInsightChart;
  profile_views: IInsightChart;
  reach: IInsightChart;
  text_message_clicks: IInsightChart;
  website_clicks: IInsightChart;
}

export interface IInstaInsight extends IInstaOverviewInsight {
  categories?: string[];
  followers_count: number;
  follows_count: number;
  id: string;
  media_count: number;
  media_data: IInstaMediaInsight[];
  medias: IInsightChart;
}
