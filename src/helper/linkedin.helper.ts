import { configuration } from '@config';
import { createReadStream } from 'fs';
import { format } from 'util';
import { I_LN_ACCESS_TOKEN_RESPONSE, I_LN_SUCCESS_RESPONSE } from '@interfaces';
import { InternalServerErrorException } from '@nestjs/common';
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

  static async postProfileStatus(connectionID: string, connectionToken: string, postCaption: string): Promise<I_LN_SUCCESS_RESPONSE> {
    const lnPostRequest = {
      method: 'POST',
      uri: 'https://api.linkedin.com/v2/ugcPosts',
      headers: {
        'X-Restli-Protocol-Version': '2.0.0',
        Authorization: `Bearer ${connectionToken} `,
      },
      body: {
        author: `urn:li:person:${connectionID}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postCaption,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'CONNECTIONS',
        },
      },
      json: true,
    };

    const response = await requestPromise(lnPostRequest);
    return response;
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
              owner: `urn:li:person:${connectionID}`,
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

        const response = LinkedInMapper.lnMediaRegisterResponseMapper(await requestPromise(registerMediaRequest));

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
        author: `urn:li:person:${connectionID}`,
        lifecycleState: 'PUBLISHED',
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
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
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
              owner: `urn:li:person:${connectionID}`,
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
        const response = LinkedInMapper.lnMediaRegisterResponseMapper(registerUploadResponse);

        const uploadMediaRequest = {
          method: 'PUT',
          uri: response.uploadUrl,
          headers: {
            'X-Restli-Protocol-Version': '2.0.0',
            ...registerUploadResponse['value']['uploadMechanism']['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['headers'],
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

  static async postProfileVideo(postInfo: PostDTO, connectionID: string, connectionToken: string): Promise<I_LN_SUCCESS_RESPONSE> {
    const media = await this.registerVideoMedia(postInfo, connectionID, connectionToken);

    const lnPostRequest = {
      method: 'POST',
      uri: 'https://api.linkedin.com/v2/ugcPosts',
      headers: {
        'X-Restli-Protocol-Version': '2.0.0',
        Authorization: `Bearer ${connectionToken}`,
      },
      body: {
        author: `urn:li:person:${connectionID}`,
        lifecycleState: 'PUBLISHED',
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
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      },
      json: true,
    };

    const response = await requestPromise(lnPostRequest);
    return response;
  }
}
