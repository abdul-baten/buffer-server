import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import to from 'await-to-js';
import { configuration } from '@config';
import { createReadStream, readFileSync } from 'fs';
import { E_LIFE_CYCLE_STATE, E_MEMBER_NETWORK_VISIBILITY, E_SHARE_MEDIA_CATEGORY } from '@enums';
import { format } from 'util';
import { I_CONNECTION, I_LN_ACCESS_TOKEN_RESPONSE, I_LN_SUCCESS_RESPONSE } from '@interfaces';
import { InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { join } from 'path';
import { LinkedInMapper } from '@mappers';
import { LoggerUtil } from '@utils';
import { PostDTO } from '@dtos';
import { randomBytes } from 'crypto';

import requestPromise = require('request-promise');
export class LinkedInHelper {
  private static clientId = configuration.default.SOCIAL_PLATFORM.LINKEDIN.CLIENT_ID;
  private static redirectURL = configuration.default.SOCIAL_PLATFORM.REDIRECT_URL;
  private static scope = configuration.default.SOCIAL_PLATFORM.LINKEDIN.SCOPE;
  private static clientSecret = configuration.default.SOCIAL_PLATFORM.LINKEDIN.CLIENT_SECRET;

  static authorize(connectionType: string): string {
    const bytes = randomBytes(12);
    const bytesString = bytes.toString('base64');
    const sanitizedString = bytesString
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    let url = format(
      'https://www.linkedin.com/uas/oauth2/authorization?response_type=code' + '&client_id=%s' + '&state=%s' + '&redirect_uri=%s',
      this.clientId,
      sanitizedString,
      encodeURIComponent(this.redirectURL + '/' + connectionType),
    );

    if (this.scope && this.scope.length > 0) {
      url += '&scope=' + this.scope.join('%20');
    }

    return url;
  }

  static async getAccessToken(connectionType: string, code: string): Promise<I_LN_ACCESS_TOKEN_RESPONSE> {
    const accessTokenRequest = {
      method: 'POST',
      uri: 'https://www.linkedin.com/oauth/v2/accessToken',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      qs: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectURL + '/' + connectionType,
      },
    };

    const response = JSON.parse(await requestPromise(accessTokenRequest));
    return response;
  }

  static async getUserInfo(accessToken: string): Promise<any> {
    const userInfoRequest = {
      method: 'GET',
      uri:
        'https://api.linkedin.com/v2/me?projection=(id,organizations,company,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))',
      headers: {
        Authorization: `Bearer ${accessToken} `,
      },
    };

    const response = JSON.parse(await requestPromise(userInfoRequest));
    return response;
  }

  static async getUserOrgs(accessToken: string): Promise<I_CONNECTION[]> {
    const userInfoRequest = {
      method: 'GET',
      uri:
        'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&projection=(elements*(organization~(localizedName)))',
      headers: {
        Authorization: `Bearer ${accessToken} `,
      },
    };

    const response = JSON.parse(await requestPromise(userInfoRequest));
    const orgs: I_CONNECTION[] = response.elements.map((element: any) => {
      return {
        connectionName: element['organization~']['localizedName'],
        connectionID: element.organization,
      };
    });

    return orgs;
  }

  static async postProfileStatus(connectionID: string, connectionToken: string, postCaption: string): Promise<any> {
    const url = 'https://api.linkedin.com/v2/ugcPosts';
    const data = {
      author: connectionID,
      lifecycleState: E_LIFE_CYCLE_STATE.PUBLISHED,
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postCaption,
          },
          shareMediaCategory: E_SHARE_MEDIA_CATEGORY.NONE,
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': E_MEMBER_NETWORK_VISIBILITY.PUBLIC,
      },
    };
    const options: AxiosRequestConfig = {
      responseType: 'json',
      headers: {
        'X-Restli-Protocol-Version': '2.0.0',
        Authorization: `Bearer ${connectionToken} `,
      },
    };
    const [error, response]: [unknown | AxiosError, AxiosResponse<any> | undefined] = await to<AxiosResponse<any>>(Axios.post(url, data, options));

    if (error) {
      const { response: errorResponse } = error as AxiosError;
      throw new UnprocessableEntityException(errorResponse);
    }

    return { response };
  }

  static async registerMedia(postInfo: PostDTO, connectionID: string, connectionToken: string) {
    try {
      const parallelRequests: any[] = [];

      for (let media of postInfo.postMedia) {
        const registerMediaRequest = {
          method: 'POST',
          uri: 'https://api.linkedin.com/v2/assets?action=registerUpload',
          headers: {
            'X-Restli-Protocol-Version': '2.0.0',
            Authorization: `Bearer ${connectionToken} `,
          },
          body: {
            registerUploadRequest: {
              recipes: [`urn:li:digitalmediaRecipe:feedshare-${postInfo.postType}`],
              owner: connectionID,
              serviceRelationships: [
                {
                  relationshipType: 'OWNER',
                  identifier: 'urn:li:userGeneratedContent',
                },
              ],
            },
          },
          json: true,
        };

        const response = LinkedInMapper.mediaRegisterResponseMapper(await requestPromise(registerMediaRequest));

        const uploadMediaRequest = {
          method: 'POST',
          uri: response.uploadUrl,
          headers: {
            'X-Restli-Protocol-Version': '2.0.0',
            Authorization: `Bearer ${connectionToken}`,
          },
          body: createReadStream(join(process.cwd(), 'upload', media)),
        };

        await requestPromise(uploadMediaRequest);
        delete response.uploadUrl;
        parallelRequests.push(response);
      }

      return parallelRequests;
    } catch (error) {
      LoggerUtil.logError(error);
      throw new InternalServerErrorException(error);
    }
  }

  static async postProfileMedia(postInfo: PostDTO, connectionID: string, connectionToken: string): Promise<any> {
    const media = await this.registerMedia(postInfo, connectionID, connectionToken);

    const lnPostRequest = {
      method: 'POST',
      uri: 'https://api.linkedin.com/v2/ugcPosts',
      headers: {
        'X-Restli-Protocol-Version': '2.0.0',
        Authorization: `Bearer ${connectionToken}`,
      },
      body: {
        author: connectionID,
        lifecycleState: E_LIFE_CYCLE_STATE.PUBLISHED,
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postInfo.postCaption,
            },
            shareMediaCategory: postInfo.postType.toUpperCase(),
            media,
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': E_MEMBER_NETWORK_VISIBILITY.PUBLIC,
        },
      },
      json: true,
    };

    const response = await requestPromise(lnPostRequest);
    return response;
  }

  static async registerVideoMedia(postInfo: PostDTO, connectionID: string, connectionToken: string) {
    try {
      const parallelRequests: any[] = [];

      for (let media of postInfo.postMedia) {
        const registerMediaRequest = {
          method: 'POST',
          uri: 'https://api.linkedin.com/v2/assets?action=registerUpload',
          headers: {
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
            Authorization: `Bearer ${connectionToken} `,
          },
          body: {
            registerUploadRequest: {
              recipes: [`urn:li:digitalmediaRecipe:feedshare-${postInfo.postType}`],
              owner: connectionID,
              serviceRelationships: [
                {
                  relationshipType: 'OWNER',
                  identifier: 'urn:li:userGeneratedContent',
                },
              ],
            },
          },
          json: true,
        };
        const registerUploadResponse = await requestPromise(registerMediaRequest);
        const response = LinkedInMapper.mediaRegisterResponseMapper(registerUploadResponse);

        const uploadMediaRequest = {
          method: 'PUT',
          uri: response.uploadUrl,
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          body: readFileSync(join(process.cwd(), 'upload', media)),
        };
        await requestPromise(uploadMediaRequest);
        delete response.uploadUrl;
        parallelRequests.push(response);
      }

      return parallelRequests;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  static async postProfileVideo(postInfo: PostDTO, connectionID: string, connectionToken: string): Promise<I_LN_SUCCESS_RESPONSE> {
    const media = await this.registerVideoMedia(postInfo, connectionID, connectionToken);

    const lnPostRequest = {
      method: 'POST',
      uri: 'https://api.linkedin.com/v2/ugcPosts',
      headers: {
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${connectionToken}`,
      },
      body: {
        author: connectionID,
        lifecycleState: E_LIFE_CYCLE_STATE.PUBLISHED,
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postInfo.postCaption,
            },
            shareMediaCategory: postInfo.postType.toUpperCase(),
            media,
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': E_MEMBER_NETWORK_VISIBILITY.PUBLIC,
        },
      },
      json: true,
    };

    const response = await requestPromise(lnPostRequest);

    return response;
  }
}
