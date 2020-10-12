import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createReadStream, readFileSync, statSync } from 'fs';
import { ETwitterUploadCommand } from '@enums';
import { fromStream } from 'file-type';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { parse } from 'query-string';
import { resolve } from 'bluebird';
import type { ITwitterTokenResponse } from '@interfaces';
import type { PostDto } from '@dtos';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterHelperService {
  constructor (private readonly configService: ConfigService) {}

  public async authorize (): Promise<string> {
    const uri = 'https://api.twitter.com/oauth/request_token';
    const config: AxiosRequestConfig = {
      params: {
        oauth: {
          consumer_key: this.configService.get('SOCIAL_PLATFORM.TWITTER.API_KEY'),
          consumer_secret: this.configService.get('SOCIAL_PLATFORM.TWITTER.API_SECRET'),
          token: this.configService.get('SOCIAL_PLATFORM.TWITTER.ACCESS_TOKEN'),
          token_secret: this.configService.get('SOCIAL_PLATFORM.TWITTER.ACCESS_TOKEN_SECRET')
        }
      }
    };
    const auth_uri = await Axios.post(uri, null, config);

    return `https://api.twitter.com/oauth/authorize?${auth_uri}`;
  }

  private async getAccessToken (oauth_token: string, oauth_verifier: string): Promise<ITwitterTokenResponse> {
    const uri = 'https://api.twitter.com/oauth/access_token';
    const config: AxiosRequestConfig = {
      params: {
        oauth_consumer_key: this.configService.get('SOCIAL_PLATFORM.TWITTER.API_KEY'),
        oauth_token,
        oauth_verifier
      }
    };
    const access_token_params = (await Axios.post(uri, null, config)).data;
    const response: ITwitterTokenResponse = parse(access_token_params) as unknown as ITwitterTokenResponse;

    return response;
  }

  private async getProfileInfoFromToken (user_id: string, screen_name: string): Promise<any> {
    const uri = 'https://api.twitter.com/1.1/users/show.json';
    const config: AxiosRequestConfig = {
      params: {
        oauth: {
          consumer_key: this.configService.get('SOCIAL_PLATFORM.TWITTER.API_KEY'),
          consumer_secret: this.configService.get('SOCIAL_PLATFORM.TWITTER.API_SECRET'),
          token: this.configService.get('SOCIAL_PLATFORM.TWITTER.ACCESS_TOKEN'),
          token_secret: this.configService.get('SOCIAL_PLATFORM.TWITTER.ACCESS_TOKEN_SECRET')
        },
        screen_name,
        user_id
      }
    };
    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  public async getProfile (oauth_token: string, oauth_verifier: string): Promise<{oauth_token_secret: string, response: any, token: string}> {
    const { user_id, screen_name, oauth_token: token, oauth_token_secret } = await this.getAccessToken(oauth_token, oauth_verifier);
    const response = this.getProfileInfoFromToken(user_id, screen_name);

    return { oauth_token_secret,
      response,
      token };
  }

  private async postTwitterStatus (post_message: string, connection_token: string, media_ids = ''): Promise<any> {
    const oauth_token_array = connection_token.split(',');
    const [token, token_secret] = oauth_token_array;
    const uri = 'https://api.twitter.com/1.1/statuses/update.json';
    const config: AxiosRequestConfig = {
      params: {
        media_ids,
        oauth: {
          consumer_key: this.configService.get('SOCIAL_PLATFORM.TWITTER.API_KEY'),
          consumer_secret: this.configService.get('SOCIAL_PLATFORM.TWITTER.API_SECRET'),
          token,
          token_secret
        },
        status: post_message
      }
    };

    const response = (await Axios.post(uri, null, config)).data;

    return response;
  }

  public async postStatus (post_message: string, connection_token: string): Promise<any> {
    const response = await this.postTwitterStatus(post_message, connection_token);

    return response;
  }

  private async getPublishedMediaIDs (post_info: PostDto, connection_token: string): Promise<string[]> {
    const oauth_token_array = connection_token.split(',');
    const [access_token_key, access_token_secret] = oauth_token_array;
    const uri = 'media/upload';
    const config: AxiosRequestConfig = {
      params: {
        access_token_key,
        access_token_secret,
        consumer_key: this.configService.get('SOCIAL_PLATFORM.TWITTER.API_KEY') as string,
        consumer_secret: this.configService.get('SOCIAL_PLATFORM.TWITTER.API_SECRET') as string
      }
    };
    const post_media_length = post_info.post_media.length;
    const requests = [];

    for (let index = 0; index < post_media_length; index += 1) {
      const media = readFileSync(join(process.cwd(), 'upload', post_info.post_media[index]));
      const request = Axios.post(uri, media, config);

      requests.push(request);
    }

    const media_ids = await Promise.all(requests);

    return media_ids.map((response: AxiosResponse) => response.data);
  }

  public async postImages (post_info: PostDto, connection_token: string): Promise<any> {
    const media_ids = await this.getPublishedMediaIDs(post_info, connection_token);
    const response = this.postTwitterStatus(post_info.post_message, connection_token, media_ids.join());

    return response;
  }

  private async publishStatusUpdate (media_id: string, post_message: string, connection: string): Promise<any> {
    const response = await this.postTwitterStatus(post_message, connection, media_id);

    return response;
  }

  private async finalizeUpload (config: AxiosRequestConfig, media_id: string): Promise<void> {
    const uri = 'media/upload';
    const data = {
      command: ETwitterUploadCommand.FINALIZE,
      media_id
    };

    await Axios.post(uri, data, config);
  }

  private async appendFileChunk (config: AxiosRequestConfig, media_id: string, media: Buffer): Promise<void> {
    const uri = 'media/upload';
    const data = {
      command: ETwitterUploadCommand.APPEND,
      media,
      media_id,
      segment_index: 0
    };

    await Axios.post(uri, data, config);
  }

  private async initializeMediaUpload (config: AxiosRequestConfig, media_size: number, media_mime_type: string): Promise<string> {
    const uri = 'media/upload';
    const data = {
      command: ETwitterUploadCommand.INIT,
      media_type: media_mime_type,
      total_bytes: media_size
    };

    const media_id_string = (await Axios.post(uri, data, config)).data;

    return media_id_string;
  }

  public async postVideos (post_info: PostDto, connection_token: string): Promise<any> {
    const oauth_token_array = connection_token.split(',');
    const [access_token_key, access_token_secret] = oauth_token_array;
    const config: AxiosRequestConfig = {
      params: {
        access_token_key,
        access_token_secret,
        consumer_key: this.configService.get('APP.SOCIAL_PLATFORM.TWITTER.API_KEY') as string,
        consumer_secret: this.configService.get('APP.SOCIAL_PLATFORM.TWITTER.API_SECRET') as string
      }
    };

    const media_file = join(process.cwd(), 'upload', post_info.post_media[0]);
    const media_data = await resolve(readFileSync(media_file));
    const media_size = await resolve(statSync(media_file).size);
    const media_mime_type = (await fromStream(createReadStream(media_file)))?.mime as string;
    const media_id = await this.initializeMediaUpload(config, media_size, media_mime_type);

    await Promise.all([this.appendFileChunk(config, media_id, media_data), this.finalizeUpload(config, media_id)]);

    const video_response = this.publishStatusUpdate(media_id, post_info.post_message, connection_token);

    return video_response;
  }
}
