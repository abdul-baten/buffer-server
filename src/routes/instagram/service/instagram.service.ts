import { catchError, defaultIfEmpty, map, pluck } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { ErrorHelper } from '@helpers';
import { from, Observable } from 'rxjs';
import { I_CONNECTION, I_FB_AUTH_ERROR, I_FB_AUTH_RESPONSE } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { LoggerUtil } from '@utils';
import { promisifyAll } from 'bluebird';
import { ConnectionMapper } from '@mappers';
import { E_CONNECTION_TYPE } from '@enums';
// import { ConnectionMapper } from '@mappers';

const Graph = require('fbgraph');
Graph.setVersion('6.0');

const _ = require('lodash');

promisifyAll(Graph);

@Injectable()
export class InstagramService {
  private FB_CLIENT_ID = this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.CLIENT_ID') as string;
  private FB_CLIENT_SECRET = this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.CLIENT_SECRET') as string;
  private FB_REDIRECT_BASE_URL = this.configService.get<string>('SOCIAL_PLATFORM.REDIRECT_URL') as string;
  private FB_SCOPE = this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.SCOPE') as string;
  private IG_PARAMS = this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.IG_PARAMS') as string;

  constructor(private readonly configService: ConfigService) {}

  private getInstagramSettings(
    connectionType: string,
  ): {
    client_id: string;
    redirect_uri: string;
  } {
    return {
      client_id: this.FB_CLIENT_ID,
      redirect_uri: `${this.FB_REDIRECT_BASE_URL}/${connectionType}`,
    };
  }

  async authenticateInstagram(connectionType: string) {
    const config = this.getInstagramSettings(connectionType);
    try {
      return Graph.getOauthUrl({
        ...config,
        scope: this.FB_SCOPE,
      });
    } catch (error) {
      LoggerUtil.logInfo(error);
    }
  }

  authorizeInstagram(code: string, connectionType: string): Observable<I_FB_AUTH_RESPONSE> {
    const config = this.getInstagramSettings(connectionType);
    return from(
      Graph.authorizeAsync({
        ...config,
        client_secret: this.FB_CLIENT_SECRET,
        code,
      }),
    ).pipe(
      map((authResponse: I_FB_AUTH_RESPONSE) => authResponse),
      catchError((error: I_FB_AUTH_ERROR) => ErrorHelper.catchFBError(error)),
    );
  }

  private instagramAccounts(accessToken: string): Observable<any> {
    const params = {
      access_token: accessToken,
      fields: this.IG_PARAMS,
    };

    return from(Graph.getAsync('me', params)).pipe(
      map(response => response),
      pluck('accounts', 'data'),
      catchError((error: I_FB_AUTH_ERROR) => ErrorHelper.catchFBError(error)),
    );
  }

  private mapFBPages(response: any[], access_token: string): I_CONNECTION[] {
    const pagesList: I_CONNECTION[] = response.map((account: any) => {
      const { instagram_business_account } = account;

      const mappedAccount = (({
        accessToken = access_token,
        connectionNetwork = E_CONNECTION_TYPE.INSTAGRAM_BUSINESS,
        id,
        profile_picture_url,
        username,
      }) => ({ id, username, profile_picture_url, accessToken, connectionNetwork }))(instagram_business_account);

      return ConnectionMapper.instagramAccountsResponseMapper(mappedAccount);
    });

    return pagesList;
  }

  getInstagramAccounts(authResponse: I_FB_AUTH_RESPONSE): Observable<I_CONNECTION[]> {
    const { access_token } = authResponse;
    const pageListObservabe$ = this.instagramAccounts(access_token);
    return pageListObservabe$.pipe(
      map((response: any) => {
        return _.map(response, _.partialRight(_.pick, ['instagram_business_account']));
      }),
      map((response: any[]) => response.filter((account: any) => account.instagram_business_account)),
      map((response: any) => this.mapFBPages(response, access_token)),
      defaultIfEmpty([]),
      catchError((error: I_FB_AUTH_ERROR) => ErrorHelper.catchFBError(error)),
    );
  }
}
