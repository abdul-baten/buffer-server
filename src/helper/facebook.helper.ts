import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import to from 'await-to-js';
import { EPostStatus } from '@enums';
import { FacebookErrorCodes } from '@errors';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import type { IFbPostPayload, IFbResponse, IPost } from '@interfaces';

@Injectable()
export class FacebookHelperService {
  private makeConfig (post_payload: IFbPostPayload): AxiosRequestConfig {
    const { connection_token, post_message, post_status, post_date_time } = post_payload;
    const config: AxiosRequestConfig = {
      params: {
        access_token: connection_token,
        message: post_message
      }
    };

    if (post_status === EPostStatus.SCHEDULED) {
      config.params.published = false;
      config.params.scheduled_publish_time = post_date_time;
    }

    return config;
  }

  async postStatus (post_payload: IFbPostPayload): Promise<IFbResponse> {
    const { connection_id } = post_payload;
    const config = this.makeConfig(post_payload);
    const uri = `https://graph.facebook.com/${connection_id}/feed`;

    const [error, response] = await to(Axios.post(uri, null, config));

    if (error) {
      throw new UnprocessableEntityException({
        ...FacebookErrorCodes.COULD_NOT_POST,
        error_details: response?.data });
    }

    const { data } = response as AxiosResponse;

    return { data };
  }

  private makeRequests (connection_id: string, connection_token: string, medias_length: number) {
    const requests: Promise<AxiosResponse<string>>[] = [];
    const uri = `https://graph.facebook.com/${connection_id}/photos`;
    const options: AxiosRequestConfig = {
      params: {
        access_token: connection_token,
        published: false,
        url: 'https://images.unsplash.com/photo-1590931743459-ae6695ba1fe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
      }
    };

    for (let index = 0; index < medias_length; index += 1) {
      requests.push(Axios.post(uri, null, options));
    }

    return requests;
  }

  public async getPublishedMediaIDs (post_info: IPost, connection_id:string, connection_token:string): Promise<string[]> {
    const medias_length = post_info.post_media?.length as number;
    const requests = this.makeRequests(connection_id, connection_token, medias_length);
    const [error] = await to(Promise.all(requests));

    if (error) {
      throw new Error(error.message);
    }

    // Return responses as string[];
    return ['sasas'];
  }

  async postImages (post_payload: IFbPostPayload): Promise<IFbResponse> {
    const { post_info, connection_id, connection_token } = post_payload;
    const media_ids = await this.getPublishedMediaIDs(post_info as IPost, connection_id, connection_token);
    const media_ids_length = media_ids.length;

    const uri = `https://graph.facebook.com/${connection_id}/feed`;
    const config = this.makeConfig(post_payload);

    for (let index = 0; index < media_ids_length; index += 1) {
      config.params[`attached_media[${index}]`] = { media_fbid: media_ids[index] };
    }

    const [error, response] = await to(Axios.post(uri, null, config));

    if (error) {
      throw new Error(error.message);
    }

    const { data } = response as AxiosResponse;

    return data;
  }

  async postVideo (post_payload: IFbPostPayload): Promise<IFbResponse> {
    const { post_info, connection_id, connection_token } = post_payload;
    const uri = `https://graph-video.facebook.com/${connection_id}/videos`;
    const config: AxiosRequestConfig = {
      params: {
        access_token: connection_token,
        description: post_info?.post_message,
        file_url: 'https://.videezy.com/system/resources/previews/000/011/317/original/openning_small_can.mp4'
      }
    };
    const [error, response] = await to(Axios.post(uri, null, config));

    if (error) {
      throw new Error(error.message);
    }

    const { data } = response as AxiosResponse;

    return data;
  }
}
