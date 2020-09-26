import { catchError, defaultIfEmpty, map, pluck, tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { ConnectionMapper } from '@mappers';
import { ErrorHelper } from '@helpers';
import { from, Observable } from 'rxjs';
import { I_CONNECTION, I_FB_AUTH_ERROR, I_FB_AUTH_RESPONSE, I_FB_GROUP, I_FB_PAGE } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { LoggerUtil } from '@utils';
import { promisifyAll } from 'bluebird';

const Graph = require('fbgraph');
Graph.setVersion('6.0');

promisifyAll(Graph);

@Injectable()
export class FacebookService {
  private FB_CLIENT_ID = this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.CLIENT_ID') as string;
  private FB_CLIENT_SECRET = this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.CLIENT_SECRET') as string;
  private FB_REDIRECT_BASE_URL = this.configService.get<string>('SOCIAL_PLATFORM.REDIRECT_URL') as string;
  private FB_SCOPE = this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.SCOPE') as string;
  private FB_PAGE_PARAMS = this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.PAGE_PARAMS') as string;
  private FB_GROUP_PARAMS = this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.GROUP_PARAMS') as string;

  constructor(private readonly configService: ConfigService) {}

  private getFacebookSettings(
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

  async authenticateFacebook(connectionType: string) {
    const config = this.getFacebookSettings(connectionType);
    try {
      return Graph.getOauthUrl({
        ...config,
        scope: this.FB_SCOPE,
      });
    } catch (error) {
      LoggerUtil.logInfo(error);
    }
  }

  authorizeFacebook(code: string, connectionType: string): Observable<I_FB_AUTH_RESPONSE> {
    const config = this.getFacebookSettings(connectionType);
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

  private getFacebookPages(accessToken: string): Observable<any> {
    const params = {
      access_token: accessToken,
      fields: this.FB_PAGE_PARAMS,
    };

    return from(Graph.getAsync('me/accounts', params)).pipe(
      map(response => response),
      catchError((error: I_FB_AUTH_ERROR) => ErrorHelper.catchFBError(error)),
    );
  }

  private getFacebookGroups(accessToken: string): Observable<any> {
    const params = {
      access_token: accessToken,
      fields: this.FB_GROUP_PARAMS,
      admin_only: true,
    };

    return from(Graph.getAsync('me/groups', params)).pipe(
      map(response => response),
      catchError((error: I_FB_AUTH_ERROR) => ErrorHelper.catchFBError(error)),
    );
  }

  private mapFBPages(response: I_FB_PAGE[]): I_CONNECTION[] {
    const pagesList: I_CONNECTION[] = [];
    response.forEach((page: I_FB_PAGE) => {
      pagesList.push(ConnectionMapper.fbPageResponseMapper(page));
    });
    return pagesList;
  }

  getFBPages(authResponse: I_FB_AUTH_RESPONSE): Observable<I_CONNECTION[]> {
    const pageListObservabe$ = this.getFacebookPages(authResponse.access_token);
    return pageListObservabe$.pipe(
      map(response => response),
      pluck('data'),
      map((response: I_FB_PAGE[]) => this.mapFBPages(response)),
      defaultIfEmpty([]),
      catchError((error: I_FB_AUTH_ERROR) => ErrorHelper.catchFBError(error)),
    );
  }

  private mapFBGroups(response: I_FB_GROUP[], accessToken: string): I_CONNECTION[] {
    const pagesList: I_CONNECTION[] = [];
    response.forEach((page: I_FB_GROUP) => {
      page.access_token = accessToken;
      pagesList.push(ConnectionMapper.fbGroupResponseMapper(page));
    });
    return pagesList;
  }

  getFBGroups(authResponse: I_FB_AUTH_RESPONSE): Observable<I_CONNECTION[]> {
    const pageListObservabe$ = this.getFacebookGroups(authResponse.access_token);
    return pageListObservabe$.pipe(
      map(response => response),
      pluck('data'),
      tap(console.warn),
      map((response: I_FB_GROUP[]) => this.mapFBGroups(response, authResponse.access_token)),
      defaultIfEmpty([]),
      catchError((error: I_FB_AUTH_ERROR) => ErrorHelper.catchFBError(error)),
    );
  }
}
