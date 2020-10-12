import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CommonUtil } from '@utils';
import { ConfigService } from '@nestjs/config';
import { ELifeCycleState, ENetworkVisibility, EShareMediaCategory } from '@enums';
import { format } from 'util';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { LinkedInMapper } from '@mappers';
import { readFileSync } from 'fs';
import { resolve } from 'bluebird';

import type { IConnection, ILnSuccess, ILnMediaRegisterPayload, ILnHeaders } from '@interfaces';
import type { PostDto } from '@dtos';

/* eslint-disable @typescript-eslint/naming-convention */
@Injectable()
export class LinkedInHelperService {
  constructor (private readonly configService: ConfigService) {}

  private commonHeaders (connection_token: string): ILnHeaders {
    return {
      Authorization: `Bearer ${connection_token}`,
      'X-Restli-Protocol-Version': '2.0.0'
    };
  }

  public async authorize (connection_type: string): Promise<string> {
    const sanitizedString = CommonUtil.base64String();
    const redirect_uri = this.configService.get('APP.SOCIAL_PLATFORM.REDIRECT_URL') as string;
    const scope = this.configService.get('APP.SOCIAL_PLATFORM.LINKEDIN.SCOPE');
    const formatted_uri = await resolve(format(
      'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=%s&state=%s&redirect_uri=%s',
      this.configService.get('APP.SOCIAL_PLATFORM.LINKEDIN.CLIENT_ID'),
      sanitizedString,
      encodeURIComponent(`${redirect_uri}/${connection_type}`)
    ));
    const uri = formatted_uri + scope && scope.length > 0 ? `&scope=${scope.join('%20')}` : '';

    return uri;
  }

  public async getAccessToken (connection_type: string, code: string): Promise<string> {
    const uri = 'https://www.linkedin.com/oauth/v2/accessToken';
    const redirect_uri = this.configService.get('APP.SOCIAL_PLATFORM.REDIRECT_URL');
    const client_secret = this.configService.get('APP.SOCIAL_PLATFORM.LINKEDIN.CLIENT_SECRET');
    const client_id = this.configService.get('APP.SOCIAL_PLATFORM.LINKEDIN.CLIENT_ID');
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        client_id,
        client_secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${redirect_uri}/${connection_type}`
      }
    };
    const response = (await Axios.post(uri, null, config)).data;

    return response;
  }

  async getUserInfo (accessToken: string): Promise<IConnection> {
    const uri =
    'https://api.linkedin.com/v2/me?projection=(id,organizations,company,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))';
    const config: AxiosRequestConfig = {
      params: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    };
    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  async getUserOrgs (accessToken: string): Promise<IConnection[]> {
    const uri =
    'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&projection=(elements*(organization~(localizedName)))';
    const config: AxiosRequestConfig = {
      params: {
        headers: {
          Authorization: `Bearer ${accessToken} `
        }
      }
    };
    const response = (await Axios.get(uri, config)).data;
    const orgs: IConnection[] = response.elements.map((element: {
      organization: never,
      [x: string]: { localizedName: string; }
    }) => ({
      connection_id: element.organization,
      connection_name: element['organization~'].localizedName
    }));

    return orgs;
  }

  async postStatus (connection_id: string, post_message: string): Promise<ILnSuccess> {
    const uri = 'https://api.linkedin.com/v2/ugcPosts';
    const data = {
      author: connection_id,
      lifecycleState: ELifeCycleState.PUBLISHED,
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: post_message
          },
          shareMediaCategory: EShareMediaCategory.NONE
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': ENetworkVisibility.PUBLIC
      }
    };
    const config: AxiosRequestConfig = {

    };
    const response = (await Axios.post(uri, data, config)).data;

    return response;
  }

  async registerMedia (post_info: PostDto, connection_id: string, connection_token: string): Promise<unknown> {
    const requests: Promise<AxiosResponse>[] = [];
    const post_medias_length = post_info.post_media.length;
    const uri = 'https://api.linkedin.com/v2/assets?action=registerUpload';
    const data = {
      registerUploadRequest: {
        owner: connection_id,
        recipes: [`urn:li:digitalmediaRecipe:feedshare-${post_info.post_type}`],
        serviceRelationships: [
          {
            identifier: 'urn:li:userGeneratedContent',
            relationshipType: 'OWNER'
          }
        ]
      }
    };
    const config: AxiosRequestConfig = {
      headers: { ...this.commonHeaders(connection_token) }
    };

    for (let index = 0; index < post_medias_length; index += 1) {
      requests.push(Axios.post(uri, data, config));
    }

    const req = await Promise.all(requests);

    return req;
  }

  async postProfileMedia (post_info: PostDto, connection_id: string, connection_token: string): Promise<ILnSuccess> {
    const media = await this.registerMedia(post_info, connection_id, connection_token);
    const uri = 'https://api.linkedin.com/v2/ugcPosts';
    const data = {
      author: connection_id,
      lifecycleState: ELifeCycleState.PUBLISHED,
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          media,
          shareCommentary: {
            text: post_info.post_message
          },
          shareMediaCategory: post_info.post_type.toUpperCase()
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': ENetworkVisibility.PUBLIC
      }
    };
    const config: AxiosRequestConfig = {
      headers: { ...this.commonHeaders(connection_token) }

    };
    const response = (await Axios.post(uri, data, config)).data;

    return response;
  }

  private async registerUpload (payload: ILnMediaRegisterPayload): Promise<Record<string, string>[]> {
    const { post_type, post_media, connection_id, connection_token } = payload;
    const register_upload_requests: Promise<AxiosResponse>[] = [];
    const post_medias_length = post_media.length;
    const register_upload_uri = 'https://api.linkedin.com/v2/assets?action=registerUpload';
    const register_upload_config: AxiosRequestConfig = {
      headers: {
        ...this.commonHeaders(connection_token),
        'Content-Type': 'application/json'
      }
    };
    const register_upload_data = {
      registerUploadRequest: {
        owner: connection_id,
        recipes: [`urn:li:digitalmediaRecipe:feedshare-${post_type}`],
        serviceRelationships: [
          {
            identifier: 'urn:li:userGeneratedContent',
            relationshipType: 'OWNER'
          }
        ]
      }
    };

    for (let index = 0; index < post_medias_length; index += 1) {
      const register_upload_request = Axios.post(register_upload_uri, register_upload_data, register_upload_config);

      register_upload_requests.push(register_upload_request);
    }

    const register_upload_responses = await Promise.all(register_upload_requests);

    return register_upload_responses.map((response: AxiosResponse) => LinkedInMapper.mediaRegisterResponseMapper(response.data));
  }

  private async registerVideoMedia (post_info: PostDto, connection_id: string, connection_token: string): Promise<string[]> {
    const { post_type, post_media } = post_info;
    const register_upload_responses = await this.registerUpload({
      connection_id,
      connection_token,
      post_media,
      post_type
    });
    const register_upload_responses_length = register_upload_responses.length;
    const requests: Promise<AxiosResponse>[] = [];

    for (let index = 0; index < register_upload_responses_length; index += 1) {
      const data = readFileSync(join(process.cwd(), 'upload', post_media[index]));
      const uri = register_upload_responses[index].uploadUrl;
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      };
      const request = Axios.put(uri, data, config);

      requests.push(request);
    }

    const response = await Promise.all(requests);

    return response.map((response: AxiosResponse) => response.data);
  }

  private commonData (configuration: {
    connection_id: string,
    connection_token: string,
    media: string[],
    post_info: PostDto,
  }): { config: AxiosRequestConfig, data: Record<string, unknown> } {
    const { post_info, media, connection_id, connection_token } = configuration;
    const config: AxiosRequestConfig = {
      headers: {
        ...this.commonHeaders(connection_token),
        'Content-Type': 'application/json'
      },
      params: {
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': ENetworkVisibility.PUBLIC
        }
      }
    };
    const data = {
      author: connection_id,
      lifecycleState: ELifeCycleState.PUBLISHED,
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          media,
          shareCommentary: {
            text: post_info.post_message
          },
          shareMediaCategory: post_info.post_type.toUpperCase()
        }
      }
    };

    return {
      config,
      data };
  }

  public async postProfileVideo (post_info: PostDto, connection_id: string, connection_token: string): Promise<ILnSuccess> {
    const media = await this.registerVideoMedia(post_info, connection_id, connection_token);
    const uri = 'https://api.linkedin.com/v2/ugcPosts';
    const { data, config } = this.commonData({
      connection_id,
      connection_token,
      media,
      post_info
    });

    const response = (await Axios.post(uri, data, config)).data;

    return response;
  }
}
