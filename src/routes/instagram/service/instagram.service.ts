import * as lodash from 'lodash';
import Axios, { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { ConnectionMapper } from '@mappers';
import { EConnectionType } from '@enums';
import { Injectable } from '@nestjs/common';
import type { IConnection, IFbAuthResponse } from '@interfaces';

@Injectable()
export class InstagramService {
  constructor (private readonly configService: ConfigService) {}

  private getInstagramSettings (connection_type: string): {
    client_id: string;
    redirect_uri: string;
  } {
    return {
      client_id: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.CLIENT_ID') as string,
      redirect_uri: `${this.configService.get('SOCIAL_PLATFORM.REDIRECT_URL')}/${connection_type}`
    };
  }

  public async authenticateInstagram (connection_type: string): Promise<string> {
    // TODO: Change URI
    const uri = 'me/groups';
    const config: AxiosRequestConfig = {
      params: {
        ...this.getInstagramSettings(connection_type),
        scope: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.SCOPE') as string
      }
    };

    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  public async authorizeInstagram (code: string, connection_type: string): Promise<IFbAuthResponse> {
    // TODO: Change URI
    const uri = 'me/groups';
    const config: AxiosRequestConfig = {
      params: {
        ...this.getInstagramSettings(connection_type),
        client_secret: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.CLIENT_SECRET') as string,
        code
      }
    };

    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  private async instagramAccounts (access_token: string): Promise<IConnection[]> {
    // TODO: Change URI
    const uri = 'me/groups';
    const config: AxiosRequestConfig = {
      params: {
        access_token,
        fields: this.configService.get('SOCIAL_PLATFORM.FACEBOOK.IG_PARAMS') as string
      }
    };

    const response = (await Axios.get(uri, config)).data;

    return response;
  }

  private mapFBPages (response: any[], token: string): IConnection[] {
    const pages_list: IConnection[] = response.map((account: any) => {
      const { instagram_business_account } = account;

      const mapped_account = (({
        access_token = token,
        connection_network = EConnectionType.INSTAGRAM_BUSINESS,
        id,
        profile_picture_url,
        username
      }) => ({
        access_token,
        connection_network,
        id,
        profile_picture_url,
        username
      }))(instagram_business_account);

      return ConnectionMapper.instagramAccountsResponseMapper(mapped_account);
    });

    return pages_list;
  }

  public async businessAccounts (auth_response: IFbAuthResponse): Promise<IConnection[]> {
    const { access_token } = auth_response;
    const pages_list = await this.instagramAccounts(access_token);
    const resp = lodash.map(pages_list, lodash.partialRight(lodash.pick, ['instagram_business_account']));
    const res = resp.filter((account: any) => account.instagram_business_account);
    const re = this.mapFBPages(res, access_token);

    return re;
  }
}
