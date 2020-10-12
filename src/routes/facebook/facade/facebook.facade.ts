import Axios, { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ConnectionMapper } from '@mappers';
import { Injectable } from '@nestjs/common';
import type { IFbAuthResponse, IConnection, IFbPageResponse } from '@interfaces';

@Injectable()
export class FacebookFacade {
  constructor (private configService: ConfigService) {}

  private getFacebookSettings (): {
    client_id: string;
    redirect_uri: string;
    } {
    return {
      client_id: this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.CLIENT_ID') as string,
      redirect_uri: this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.REDIRECT_URL') as string
    };
  }

  async authenticateFacebook (): Promise<string> {
    const uri = '';
    const config: AxiosRequestConfig = {
      params: {
        ...this.getFacebookSettings(),
        scope: this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.SCOPE') as string
      }
    };

    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  async authorizeFacebook (code: string): Promise<IFbAuthResponse> {
    const uri = '';
    const config: AxiosRequestConfig = {
      params: {
        ...this.getFacebookSettings(),
        client_secret: this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.CLIENT_SECRET') as string,
        code
      }
    };

    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  private async getFacebookPages (connection_token: string): Promise<IFbPageResponse[]> {
    const uri = 'https://graph.facebook.com/me/accounts';
    const config: AxiosRequestConfig = {
      params: {
        access_token: connection_token,
        fields: 'picture{url},name,category,id,access_token'
      }
    };
    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  private mapFBPages (response: IFbPageResponse[]): IConnection[] {
    const pages_list: IConnection[] = [];
    const response_length = response.length;

    for (let index = 0; index < response_length; index += 1) {
      pages_list.push(ConnectionMapper.fbPageResponseMapper(response[index] as unknown as IConnection));
    }

    return pages_list;
  }

  public async getFBPages (auth_response: IFbAuthResponse): Promise<IConnection[]> {
    const pages_list = await this.getFacebookPages(auth_response.access_token);
    const response = this.mapFBPages(pages_list);

    return response;
  }
}
