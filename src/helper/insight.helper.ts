import { addDays, eachDayOfInterval, format } from 'date-fns';
import { I_INS_CHART, I_INS_FB, I_INS_FB_POST_ITEM, I_INS_IG, I_INS_POST } from '@interfaces';
import { InsightMapper } from '@mappers';

import requestPromise = require('request-promise');

const _ = require('lodash');

export class InsightHelper {
  private static sanitizeResponse(payload: Record<string, any>): I_INS_CHART {
    const response = _.map(payload, 'value');
    const total = response.reduce((accumulator: number, currentValue: number) => accumulator + currentValue);
    return {
      total,
      response,
    };
  }

  private static sanitizePostsResponse(payload: any): Partial<I_INS_POST> {
    const createdDates = _.map(payload, 'created_time').map((date: any) => format(new Date(date), 'dd LLL'));
    const result = _.values(_.groupBy(createdDates)).map((d: string | any[]) => ({ date: d[0], count: d.length }));
    const dates = _.map(result, 'date');
    const values = _.map(result, 'count');

    const payloadResponse: I_INS_FB_POST_ITEM[] = payload.map((response: Record<string, any>) => InsightMapper.fbPostResponseMapper(response));

    return {
      posts: { total: createdDates.length, categories: dates.reverse(), response: values.reverse() },
      tableData: payloadResponse,
      ...InsightMapper.fbPostDataResponseMapper(payload),
    };
  }

  static async getFacebookInsight(id: string, connectionToken: string, since: string, until: string): Promise<Partial<I_INS_FB>> {
    const dateSince: string = format(new Date(since), 'yyyy-MM-dd');
    const dateUntil: string = format(addDays(new Date(until), 2), 'yyyy-MM-dd');

    const categories = eachDayOfInterval({
      start: new Date(since),
      end: new Date(until),
    }).map((date: any) => format(new Date(date), 'dd LLL'));

    const batchRequest = [
      {
        method: 'GET',
        relative_url: `${id}/insights/
        page_engaged_users,page_impressions,page_impressions_unique,page_fan_adds,page_fan_removes,
        page_total_actions,page_call_phone_clicks_logged_in_unique,page_get_directions_clicks_logged_in_unique,

        page_actions_post_reactions_like_total,page_actions_post_reactions_love_total,page_actions_post_reactions_wow_total,page_actions_post_reactions_haha_total,page_actions_post_reactions_sorry_total,page_actions_post_reactions_anger_total,page_actions_post_reactions_total,

        page_views_total,page_views_logout,page_views_logged_in_total,

        page_video_views,page_video_views_paid,page_video_views_organic,page_video_views_autoplayed,page_video_views_click_to_play,page_video_views_unique,page_video_repeat_views,

        page_video_complete_views_30s,page_video_complete_views_30s_paid,page_video_complete_views_30s_organic,page_video_complete_views_30s_autoplayed,page_video_complete_views_30s_click_to_play,page_video_complete_views_30s_unique,page_video_complete_views_30s_repeat_views,
        page_video_views_10s,page_video_views_10s_paid,page_video_views_10s_organic,page_video_views_10s_autoplayed,page_video_views_10s_click_to_play,page_video_views_10s_unique,page_video_views_10s_repeat,
        
        page_website_clicks_logged_in_unique,page_tab_views_login_top/day?fields=name,values&since=${dateSince}&until=${dateUntil}`,
      },
      {
        method: 'GET',
        relative_url: `${id}/posts?fields=likes.summary(total_count),comments.summary(total_count),
        created_time,reactions.summary(total_count),permalink_url,id,shares,message_tags,message,picture,
        insights.metric(post_engaged_users,post_engaged_fan,post_impressions,post_impressions_unique,post_impressions_organic,post_impressions_paid,post_clicks,post_negative_feedback){values}
        &since=${dateSince}&until=${dateUntil}&limit=100`,
      },
      {
        method: 'GET',
        relative_url: `${id}?fields=new_like_count,fan_count,rating_count,talking_about_count,were_here_count&since=${dateSince}&until=${dateUntil}`,
      },
    ];

    const requests = {
      method: 'POST',
      uri: 'https://graph.facebook.com/',
      qs: {
        access_token: connectionToken,
        batch: JSON.stringify(batchRequest),
        include_headers: false,
      },
    };

    const response: any = {};
    const responses = JSON.parse(await requestPromise(requests));
    const pageResponse = JSON.parse(JSON.parse(JSON.stringify(responses[0].body))).data;
    pageResponse.forEach((data: any) => (response[data.name] = this.sanitizeResponse(data.values)));
    const postData = this.sanitizePostsResponse(JSON.parse(responses[1].body).data);
    // const page_actions = JSON.parse(responses[2].body);

    return { categories, postData, ...response };
  }

  private static sanitizeMediaResponse(payload: any): any {
    const createdDates = _.map(payload, 'timestamp').map((date: any) => format(new Date(date), 'dd LLL'));
    const result = _.values(_.groupBy(createdDates)).map((d: string | any[]) => ({ date: d[0], count: d.length }));
    const dates = _.map(result, 'date');
    const values = _.map(result, 'count');

    return { total: createdDates.length, categories: dates.reverse(), response: values.reverse() };
  }

  static async getInstagramInsight(id: string, connectionToken: string, since: string, until: string): Promise<Partial<I_INS_IG>> {
    const dateSince: string = format(new Date(since), 'yyyy-MM-dd');
    const dateUntil: string = format(addDays(new Date(until), 2), 'yyyy-MM-dd');

    const categories = eachDayOfInterval({
      start: new Date(since),
      end: new Date(until),
    }).map((date: any) => format(new Date(date), 'dd LLL'));

    const batchRequest = [
      {
        method: 'GET',
        relative_url: `${id}?fields=follows_count,followers_count,media_count,
        insights.metric(impressions,reach,profile_views,phone_call_clicks,text_message_clicks,website_clicks,follower_count).period(day).fields(name,values),
        media{caption,comments,comments_count,like_count,media_type,media_url,permalink,timestamp,insights.metric(engagement,impressions,reach,saved).fields(name,values)}
        &since=${dateSince}&until=${dateUntil}`,
      },
    ];

    const requests = {
      method: 'POST',
      uri: 'https://graph.facebook.com/',
      qs: {
        access_token: connectionToken,
        batch: JSON.stringify(batchRequest),
        include_headers: false,
      },
    };

    const response: any = {};
    const responses = JSON.parse(await requestPromise(requests));

    const accountResponse = JSON.parse(JSON.parse(JSON.stringify(responses))[0].body);
    const { follower_count, followers_count, follows_count, media_count } = accountResponse as I_INS_IG;
    accountResponse.insights.data.forEach((data: any) => (response[data.name] = this.sanitizeResponse(data.values)));

    const mediaData = accountResponse.media.data.map((media: any) => {
      const {
        caption,
        comments_count,
        like_count,
        media_type,
        media_url,
        permalink,
        timestamp: createdTime,
        insights: { data },
      } = media;
      const mediaInsights: any = {};
      data.forEach((data: any) => (mediaInsights[data.name] = this.sanitizeResponse(data.values)));

      return { caption, comments_count, like_count, media_type, media_url, permalink, createdTime, ...mediaInsights };
    });

    const medias = this.sanitizeMediaResponse(accountResponse.media.data);

    return { categories, follower_count, followers_count, media_count, follows_count, ...response, mediaData, medias };
  }
}
