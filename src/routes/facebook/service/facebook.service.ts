import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import to from 'await-to-js';
import { ConfigService } from '@nestjs/config';
import { FacebookErrorCodes, GeneralErrorCodes } from '@errors';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promisifyAll } from 'bluebird';
import type {
  IConnection,
  IRedirectResponse,
  IFbAuthResponse,
  IFbGroup,
  IFbPage,
  IFbCommonResponse
} from '@interfaces';
import { FacebookMapper } from '@mappers';
import { URL } from 'url';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Graph = require('fbgraph').setVersion('8.0');

promisifyAll(Graph);

@Injectable()
export class FacebookService {
  constructor (private readonly configService: ConfigService) {}

  private getFacebookSettings (connection_type: string): {
    client_id: string;
    redirect_uri: string;
  } {
    return {
      client_id: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.CLIENT_ID') as string,
      redirect_uri: `${this.configService.get('SOCIAL_PLATFORM.REDIRECT_URL') as string}/${connection_type}`
    };
  }

  public authenticateFacebook (connection_type: string): IRedirectResponse {
    const redirect_uri = new URL('https://www.facebook.com/v8.0/dialog/oauth');

    redirect_uri.searchParams.append('auth_type', 'rerequest');
    redirect_uri.searchParams.append('display', 'popup');
    redirect_uri.searchParams.append('response_type', 'code');
    redirect_uri.searchParams.append('scope', this.configService.get('SOCIAL_PLATFORM.FACEBOOK.SCOPE') as string);
    redirect_uri.searchParams.append('client_id', this.configService.get('SOCIAL_PLATFORM.FACEBOOK.CLIENT_ID') as string);
    redirect_uri.searchParams.append('redirect_uri', `${this.configService.get('SOCIAL_PLATFORM.REDIRECT_URL') as string}/${connection_type}`);

    return { redirect_uri: redirect_uri.toString() };
  }

  public async authorizeFacebook (code: string, connection_type: string): Promise<IFbAuthResponse> {
    const [error, authorize_response] = await to<IFbAuthResponse>(Graph.authorizeAsync({
      ...this.getFacebookSettings(connection_type),
      client_secret: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.CLIENT_SECRET') as string,
      code
    }));

    if (error) {
      throw new InternalServerErrorException({
        ...GeneralErrorCodes.SOMETHING_WENT_WRONG,
        error_details: error
      });
    }

    return authorize_response as IFbAuthResponse;
  }

  private async getPagesFromRequest (connection_token: string): Promise<IFbPage[]> {
    const uri: string = this.configService.get('SOCIAL_PLATFORM.FACEBOOK.PAGE_API') as string;
    const config: AxiosRequestConfig = {
      params: {
        access_token: connection_token,
        fields: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.PAGE_PARAMS') as string
      }
    };
    const [error, request_response] = await to<AxiosResponse<IFbCommonResponse<IFbPage>>>(Axios.get(uri, config));

    if (error) {
      throw new InternalServerErrorException({
        ...FacebookErrorCodes.COULD_NOT_FETCH_PAGES,
        error_details: error
      });
    }

    const { data: page_raw_response } = request_response as AxiosResponse<IFbCommonResponse<IFbPage>>;
    const { data: page_response } = page_raw_response;

    return page_response;
  }

  public async getPages (access_token: string): Promise<IConnection[]> {
    const facebook_pages: IFbPage[] = await this.getPagesFromRequest(access_token);
    const pages_response: IConnection[] = [];
    const facebook_pages_length: number = facebook_pages.length;

    if (facebook_pages_length) {
      let index = 0;

      while (index < facebook_pages_length) {
        pages_response.push(FacebookMapper.pageResponseMapper(facebook_pages[index]));
        index += 1;
      }
    }

    return pages_response;
  }

  private async getGroupsFromRequest (connection_token: string): Promise<IFbGroup[]> {
    const uri: string = this.configService.get('SOCIAL_PLATFORM.FACEBOOK.GROUP_API') as string;
    const config: AxiosRequestConfig = {
      params: {
        access_token: connection_token,
        admin_only: true,
        fields: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.GROUP_PARAMS') as string
      }
    };
    const [error, request_response] = await to<AxiosResponse<IFbCommonResponse<IFbGroup>>>(Axios.get(uri, config));

    if (error) {
      throw new InternalServerErrorException({
        ...FacebookErrorCodes.COULD_NOT_FETCH_GROUPS,
        error_details: error
      });
    }

    const { data: group_raw_response } = request_response as AxiosResponse<IFbCommonResponse<IFbGroup>>;
    const { data: group_response } = group_raw_response;

    return group_response;
  }

  public async getGroups (access_token: string): Promise<IConnection[]> {
    const facebook_groups: IFbGroup[] = await this.getGroupsFromRequest(access_token);
    const groups_response: IConnection[] = [];
    const { length } = facebook_groups;

    if (length) {
      let index = 0;

      while (index < length) {
        const group = {
          ...facebook_groups[index],
          access_token
        };

        groups_response.push(FacebookMapper.groupResponseMapper(group));
        index += 1;
      }
    }

    return groups_response;
  }
}
