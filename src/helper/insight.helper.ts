import * as lodash from 'lodash';
import Axios, { AxiosRequestConfig } from 'axios';
import { addDays, eachDayOfInterval, format } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { InsightMapper } from '@mappers';
import type { IFbOverviewInsight, IFbPerformanceInsight, IFbPost, IFbPostInsight, IFbVideoInsight, IInsightChart, IInstaInsight } from '@interfaces';

@Injectable()
export class InsightHelperService {
  private sanitizeResponse (payload: Record<string, any>): IInsightChart {
    const response = lodash.map(payload, 'value');
    const total = response.reduce((accumulator: number, current: number) => accumulator + current);

    return {
      response,
      total
    };
  }

  private sanitizeMediaResponse (payload: any): any {
    const created_dates = lodash.map(payload, 'timestamp').map((date: any) => format(new Date(date), 'dd LLL'));
    const result = lodash.values(lodash.groupBy(created_dates)).map((dates: string | any[]) => ({
      count: dates.length,
      date: dates[0] }));
    const dates = lodash.map(result, 'date');
    const values = lodash.map(result, 'count');

    return {
      categories: dates.reverse(),
      response: values.reverse(),
      total: created_dates.length
    };
  }

  async getInstagramInsight (id: string, connection_token: string, since: string, until: string): Promise<Partial<IInstaInsight>> {
    const date_since: string = format(new Date(since), 'yyyy-MM-dd');
    const date_until: string = format(addDays(new Date(until), parseInt('2', 10)), 'yyyy-MM-dd');

    const categories = eachDayOfInterval({
      end: new Date(until),
      start: new Date(since)
    }).map((date: any) => format(new Date(date), 'dd LLL'));

    const batch_request = [
      {
        method: 'GET',
        relative_url: `${id}?fields=follows_count,followers_count,media_count,
        insights.metric(impressions,reach,profile_views,phone_call_clicks,text_message_clicks,website_clicks,follower_count).period(day).fields(name,values),
        media{caption,comments,comments_count,like_count,media_type,media_url,permalink,timestamp,insights.metric(engagement,impressions,reach,saved).fields(name,values)}
        &since=${date_since}&until=${date_until}`
      }
    ];

    const uri = 'https://graph.facebook.com/';
    const config: AxiosRequestConfig = {
      params: {
        access_token: connection_token,
        batch: JSON.stringify(batch_request),
        include_headers: false
      }
    };

    const response: any = {};
    const responses = (await Axios.post(uri, null, config)).data;

    const account_response = JSON.parse(JSON.parse(JSON.stringify(responses))[0].body);
    const { follower_count, followers_count, follows_count, media_count } = account_response as IInstaInsight;

    account_response.insights.data.forEach((data: any) => {
      response[data.name] = this.sanitizeResponse(data.values);
    });

    const media_data = account_response.media.data.map((media: any) => {
      const {
        caption,
        comments_count,
        like_count,
        media_type,
        media_url,
        permalink,
        timestamp: created_time,
        insights: { data }
      } = media;
      const media_insight: any = {};

      data.forEach((data: any) => {
        media_insight[data.name] = this.sanitizeResponse(data.values);
      });

      return {
        ...media_insight,
        caption,
        comments_count,
        created_time,
        like_count,
        media_type,
        media_url,
        permalink
      };
    });

    const medias = this.sanitizeMediaResponse(account_response.media.data);

    return {
      ...response,
      categories,
      follower_count,
      followers_count,
      follows_count,
      media_count,
      media_data,
      medias
    };
  }

  private getTimeRange (since: string, until: string): { date_since: string; date_until: string; categories: string[] } {
    const date_since: string = format(new Date(since), 'yyyy-MM-dd');
    const date_until: string = format(addDays(new Date(until), parseInt('2', 10)), 'yyyy-MM-dd');

    const categories = eachDayOfInterval({
      end: new Date(until),
      start: new Date(since)
    }).map((date: Date) => format(new Date(date), 'dd LLL'));

    return {
      categories,
      date_since,
      date_until
    };
  }

  // TODO: REMOVE ALL METHODS ABOVE
  public async overview (
    mongo_connection_id: string,
    connection_id: string,
    connection_token: string,
    since: string,
    until: string
  ): Promise<Partial<IFbOverviewInsight>> {
    const { date_since, date_until, categories } = this.getTimeRange(since, until),
      url = `https://graph.facebook.com/${connection_id}/insights/page_engaged_users,page_impressions,
    page_actions_post_reactions_anger_total,
    page_actions_post_reactions_haha_total,
    page_actions_post_reactions_like_total,
    page_actions_post_reactions_love_total,
    page_actions_post_reactions_sorry_total,
    page_actions_post_reactions_total,
    page_actions_post_reactions_wow_total,
    page_fan_adds,
    page_fan_removes,
    page_impressions_unique,
    page_views_total,
    /day?fields=name,values&since=${date_since}&until=${date_until}`,
      options: AxiosRequestConfig = {
        params: {
          access_token: connection_token
        }
      };

    const response: { [key: string]: any } = {};
    const { data } = await Axios.get(url, options);

    data.data.forEach((data: any) => {
      response[data.name] = this.sanitizeResponse(data.values);
    });

    return {
      ...response,
      categories,
      id: mongo_connection_id
    };
  }

  private sanitizePostsResponse (payload: any): Partial<IFbPostInsight> {
    const created_dates = lodash.map(payload, 'created_time').map((date: any) => format(new Date(date), 'dd LLL'));
    const result = lodash.values(lodash.groupBy(created_dates)).map((dates: string | any[]) => ({
      count: dates.length,
      date: dates[0]
    }));
    const dates = lodash.map(result, 'date');
    const values = lodash.map(result, 'count');

    const posts_table: IFbPost[] = payload.map((response: Record<string, any>) => InsightMapper.fbPostResponseMapper(response));

    return {
      posts: {
        categories: dates.reverse(),
        response: values.reverse(),
        total: created_dates.length
      },
      posts_table,
      ...InsightMapper.fbPostDataResponseMapper(payload)
    };
  }

  async posts (mongo_connection_id: string, connection_id: string, connection_token: string, since: string, until: string): Promise<Partial<IFbPostInsight>> {
    const { date_since, date_until, categories } = this.getTimeRange(since, until),
      url = `https://graph.facebook.com/${connection_id}/posts?fields=likes.summary(total_count),comments.summary(total_count),
      created_time,reactions.summary(total_count),permalink_url,id,shares,message_tags,message,picture,
      insights.metric(post_engaged_users,post_engaged_fan,post_impressions,post_impressions_unique,post_impressions_organic,
      post_impressions_paid,post_clicks,post_negative_feedback){values}
      &since=${date_since}&until=${date_until}&limit=100`,
      options: AxiosRequestConfig = {
        params: {
          access_token: connection_token
        }
      };

    const { data } = await Axios.get(url, options);
    const post_data = this.sanitizePostsResponse(data.data);

    return {
      ...post_data,
      categories,
      id: mongo_connection_id
    };
  }

  public async videos (mongo_connection_id: string, connection_id: string, connection_token: string, since: string, until: string): Promise<Partial<IFbVideoInsight>> {
    const { date_since, date_until, categories } = this.getTimeRange(since, until),
      url = `https://graph.facebook.com/${connection_id}/insights/
      page_video_views,page_video_views_paid,page_video_views_organic,page_video_views_autoplayed,page_video_views_click_to_play,
      page_video_views_unique,page_video_repeat_views,page_video_complete_views_30s,page_video_complete_views_30s_paid,page_video_complete_views_30s_organic,
      page_video_complete_views_30s_autoplayed,page_video_complete_views_30s_click_to_play,page_video_complete_views_30s_unique,page_video_complete_views_30s_repeat_views,
      page_video_views_10s,page_video_views_10s_paid,page_video_views_10s_organic,page_video_views_10s_autoplayed,
      page_video_views_10s_click_to_play,page_video_views_10s_unique,page_video_views_10s_repeat
      /day?fields=name,values&since=${date_since}&until=${date_until}`,
      options: AxiosRequestConfig = {
        params: {
          access_token: connection_token
        }
      };

    const response: { [key: string]: any } = {};
    const { data } = await Axios.get(url, options);

    data.data.forEach((data: any) => {
      response[data.name] = this.sanitizeResponse(data.values);
    });

    return {
      ...response,
      categories,
      id: mongo_connection_id
    };
  }

  public async performance (
    mongo_connection_id: string,
    connection_id: string,
    connection_token: string,
    since: string,
    until: string
  ): Promise<Partial<IFbPerformanceInsight>> {
    const { date_since, date_until, categories } = this.getTimeRange(since, until),
      url = `https://graph.facebook.com/${connection_id}/insights/
      page_call_phone_clicks_logged_in_unique,page_get_directions_clicks_logged_in_unique,
      page_tab_views_login_top,page_total_actions,page_views_logged_in_total,page_views_logout,page_website_clicks_logged_in_unique
      /day?fields=name,values&since=${date_since}&until=${date_until}`,
      options: AxiosRequestConfig = {
        params: {
          access_token: connection_token
        }
      };

    const response: { [key: string]: any } = {};
    const { data } = await Axios.get(url, options);

    data.data.forEach((data: any) => {
      response[data.name] = this.sanitizeResponse(data.values);
    });

    return {
      ...response,
      categories,
      id: mongo_connection_id
    };
  }
}
