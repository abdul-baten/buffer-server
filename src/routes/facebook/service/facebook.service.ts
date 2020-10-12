import Axios, { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ConnectionMapper } from '@mappers';
import { Injectable } from '@nestjs/common';
import type {
  IConnection,
  IFbAuthResponse,
  IFbGroup,
  IFbPage
} from '@interfaces';

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

  public async authenticateFacebook (connection_type: string): Promise<any> {
    const uri = 'me/groups';
    const config: AxiosRequestConfig = {
      params: {
        ...this.getFacebookSettings(connection_type),
        scope: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.SCOPE') as string
      }
    };
    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  public async authorizeFacebook (code: string, connection_type: string): Promise<IFbAuthResponse> {
    const uri = 'me/groups';
    const config: AxiosRequestConfig = {
      params: {
        ...this.getFacebookSettings(connection_type),
        client_secret: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.CLIENT_SECRET') as string,
        code
      }
    };
    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  private async getFacebookPages (connection_token: string): Promise<IFbPage[]> {
    const uri = 'me/accounts';
    const config: AxiosRequestConfig = {
      params: {
        access_token: connection_token,
        fields: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.PAGE_PARAMS') as string
      }
    };
    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  private async getFacebookGroups (connection_token: string): Promise<IFbGroup[]> {
    const uri = 'me/groups';
    const config: AxiosRequestConfig = {
      params: {
        access_token: connection_token,
        admin_only: true,
        fields: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.GROUP_PARAMS') as string
      }
    };
    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  private mapFBPages (response: IFbPage[]): IConnection[] {
    const pages_list: IConnection[] = [];

    response.forEach((page: IFbPage) => {
      pages_list.push(ConnectionMapper.fbPageResponseMapper(page));
    });

    return pages_list;
  }

  public async getFBPages (aith_response: IFbAuthResponse): Promise<IConnection[]> {
    const pages = await this.getFacebookPages(aith_response.access_token);
    const response = this.mapFBPages(pages);

    return response;
  }

  private mapFBGroups (response: IFbGroup[], connection_token: string): IConnection[] {
    const pages_list: IConnection[] = [];

    response.forEach((group: IFbGroup) => {
      // eslint-disable-next-line no-param-reassign
      group.access_token = connection_token;
      pages_list.push(ConnectionMapper.fbGroupResponseMapper(group));
    });

    return pages_list;
  }

  public async getFBGroups (auth_response: IFbAuthResponse): Promise<IConnection[]> {
    const response = await this.getFacebookGroups(auth_response.access_token);

    return this.mapFBGroups(response, auth_response.access_token);
  }
}
