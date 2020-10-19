import Axios, { AxiosRequestConfig } from 'axios';
import lodash from 'lodash';
import to from 'await-to-js';
import { addDays, eachDayOfInterval, format } from 'date-fns';
import { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InsightMapper } from '@mappers';
import type { IFbOverviewInsight, IFbPerformanceInsight, IFbPost, IFbPostInsight, IFbVideoInsight, IInsightChart, IInsightFromDbPayload } from '@interfaces';

@Injectable()
export class FacebookInsightHelperService {
  public async getOverviewInsight (model: Model<IFbOverviewInsight>, insight_payload: IInsightFromDbPayload): Promise<IFbOverviewInsight> {
    const [error, connection] = await to(model.findOne({ ...insight_payload }).select('-__v').
      lean(true).
      exec());

    if (error) {
      throw new Error(error.message);
    }

    return connection as IFbOverviewInsight;
  }

  public async setOverviewInsight (
    model: Model<IFbOverviewInsight>,
    payload: Partial<IFbOverviewInsight>
  ): Promise<IFbOverviewInsight> {
    const abc = new model(payload);
    const [error, overview] = await to(abc.save());

    if (error) {
      throw new Error(error.message);
    }

    return overview as IFbOverviewInsight;
  }

  public async getVideoInsight (model: Model<IFbVideoInsight>, insight_payload: IInsightFromDbPayload): Promise<IFbVideoInsight> {
    const [error, connection] = await to(model.findOne({ ...insight_payload }).select('-__v').
      lean(true).
      exec());

    if (error) {
      throw new Error(error.message);
    }

    return connection as IFbVideoInsight;
  }

  public async setVideoInsight (
    model: Model<IFbVideoInsight>,
    payload: Partial<IFbVideoInsight>
  ): Promise<IFbVideoInsight> {
    const abc = new model(payload);
    const [error, overview] = await to(abc.save());

    if (error) {
      throw new Error(error.message);
    }

    return overview as IFbVideoInsight;
  }

  public async getInsight<T extends Document> (model: Model<T>, insight_payload: IInsightFromDbPayload): Promise<T> {
    const [error, connection] = await to(model.findOne({ ...Object(insight_payload) }).select('-__v').
      lean(true).
      exec());

    if (error) {
      throw new Error(error.message);
    }

    return connection as unknown as T;
  }

  public async setPerformanceInsight<T extends Document> (
    model: Model<T>,
    payload: Partial<T>
  ): Promise<T> {
    const payload_model = new model(payload);
    const [error, overview] = await to(payload_model.save());

    if (error) {
      throw new Error(error.message);
    }

    return overview as T;
  }

  private getParams (access_token: string): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      params: {
        access_token
      }
    };

    return config;
  }

  private sanitizeResponse (payload: Record<string, any>[]): IInsightChart {
    const payload_values_array: number[] = [];
    const payload_length: number = payload.length;
    let index = 0;

    while (index < payload_length) {
      payload_values_array.push(payload[index].value);
      index += 1;
    }

    const total = payload_values_array.reduce((accumulator: number, current: number) => accumulator + current);

    return {
      response: payload_values_array,
      total
    };
  }

  private getTimeRange (since: string, until: string): { date_since: string; date_until: string; categories: string[] } {
    const date_since: string = format(new Date(since), 'yyyy-MM-dd');
    const date_until: string = format(addDays(new Date(until), Number.parseInt('2', 10)), 'yyyy-MM-dd');

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

  public async overview (
    connection_id: string,
    connection_token: string,
    since: string,
    until: string
  ): Promise<Partial<IFbOverviewInsight>> {
    const { date_since, date_until, categories } = this.getTimeRange(since, until);
    const uri = `https://graph.facebook.com/${connection_id}/insights/page_engaged_users,page_impressions,
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
    /day?fields=name,values&since=${date_since}&until=${date_until}`;
    const config = this.getParams(connection_token);
    const [error, insight] = await to(Axios.get(uri, config));

    if (error) {
      throw new Error(error.message);
    }

    const response: { [key: string]: any } = {};
    const overview = insight?.data.data;
    const overview_response_length = overview.length;
    let index = 0;

    while (index < overview_response_length) {
      response[overview[index].name] = this.sanitizeResponse(overview[index].values);
      index += 1;
    }

    return {
      ...response,
      categories
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

  async posts (connection_id: string, connection_token: string, since: string, until: string): Promise<Partial<IFbPostInsight>> {
    const { date_since, date_until, categories } = this.getTimeRange(since, until);
    const uri = `https://graph.facebook.com/${connection_id}/posts?fields=likes.summary(total_count),comments.summary(total_count),
      created_time,reactions.summary(total_count),permalink_url,id,shares,message_tags,message,picture,
      insights.metric(post_engaged_users,post_engaged_fan,post_impressions,post_impressions_unique,post_impressions_organic,
      post_impressions_paid,post_clicks,post_negative_feedback){values}
      &since=${date_since}&until=${date_until}&limit=100`;
    const config = this.getParams(connection_token);
    const { data } = await Axios.get(uri, config);
    const post_data = this.sanitizePostsResponse(data.data);

    return {
      ...post_data,
      categories
    };
  }

  public async videos (connection_id: string, connection_token: string, since: string, until: string): Promise<Partial<IFbVideoInsight>> {
    const { date_since, date_until, categories } = this.getTimeRange(since, until);
    const uri = `https://graph.facebook.com/${connection_id}/insights/
      page_video_views,page_video_views_paid,page_video_views_organic,page_video_views_autoplayed,page_video_views_click_to_play,
      page_video_views_unique,page_video_repeat_views,page_video_complete_views_30s,page_video_complete_views_30s_paid,page_video_complete_views_30s_organic,
      page_video_complete_views_30s_autoplayed,page_video_complete_views_30s_click_to_play,page_video_complete_views_30s_unique,page_video_complete_views_30s_repeat_views,
      page_video_views_10s,page_video_views_10s_paid,page_video_views_10s_organic,page_video_views_10s_autoplayed,
      page_video_views_10s_click_to_play,page_video_views_10s_unique,page_video_views_10s_repeat
      /day?fields=name,values&since=${date_since}&until=${date_until}`;
    const config = this.getParams(connection_token);
    const [error, insight] = await to(Axios.get(uri, config));

    if (error) {
      throw new Error(error.message);
    }

    const response: { [key: string]: any } = {};
    const videos = insight?.data.data;
    const videos_response_length = videos.length;
    let index = 0;

    while (index < videos_response_length) {
      response[videos[index].name] = this.sanitizeResponse(videos[index].values);
      index += 1;
    }

    return {
      ...response,
      categories
    };
  }

  public async performance (
    connection_id: string,
    connection_token: string,
    since: string,
    until: string
  ): Promise<Partial<IFbPerformanceInsight>> {
    const { date_since, date_until, categories } = this.getTimeRange(since, until);
    const uri = `https://graph.facebook.com/${connection_id}/insights/
      page_call_phone_clicks_logged_in_unique,page_get_directions_clicks_logged_in_unique,
      page_tab_views_login_top,page_total_actions,page_views_logged_in_total,page_views_logout,page_website_clicks_logged_in_unique
      /day?fields=name,values&since=${date_since}&until=${date_until}`;
    const config = this.getParams(connection_token);
    const [error, insight] = await to(Axios.get(uri, config));

    if (error) {
      throw new Error(error.message);
    }

    const response: { [key: string]: any } = {};
    const performance = insight?.data.data;
    const performance_response_length = performance.length;
    let index = 0;

    while (index < performance_response_length) {
      response[performance[index].name] = this.sanitizeResponse(performance[index].values);
      index += 1;
    }

    return {
      ...response,
      categories
    };
  }
}
