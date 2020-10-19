import Axios, { AxiosRequestConfig } from 'axios';
import lodash from 'lodash';
import { addDays, eachDayOfInterval, format } from 'date-fns';
import { Injectable } from '@nestjs/common';

import type { IInsightChart, IInstaInsight } from '@interfaces';

@Injectable()
export class InstagramInsightHelperService {
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

  private sanitizeMediaResponse (payload: any): any {
    const created_dates = lodash.map(payload, 'timestamp').map((date: string) => format(new Date(date), 'dd LLL'));
    const result = lodash.values(lodash.groupBy(created_dates)).map((dates: string | string[]) => ({
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
    const date_until: string = format(addDays(new Date(until), Number.parseInt('2', 10)), 'yyyy-MM-dd');

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

  // TODO: REMOVE ALL METHODS ABOVE
}
