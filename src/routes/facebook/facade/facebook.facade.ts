import { catchError, defaultIfEmpty, map, pluck } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { ConnectionMapper } from '@mappers';
import { ErrorHelper } from '@helpers';
import { from, Observable } from 'rxjs';
import { I_CONNECTION, I_FB_AUTH_ERROR, I_FB_AUTH_RESPONSE, I_FB_PAGE } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { LoggerUtil } from '@utils';
import { promisifyAll } from 'bluebird';

const Graph = require('fbgraph');
Graph.setVersion('6.0');

promisifyAll(Graph);

@Injectable()
export class FacebookFacade {
  constructor(private configService: ConfigService) {}

  private getFacebookSettings(): {
    client_id: string;
    redirect_uri: string;
  } {
    return {
      client_id: this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.CLIENT_ID') as string,
      redirect_uri: this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.REDIRECT_URL') as string,
    };
  }

  async authenticateFacebook() {
    const config = this.getFacebookSettings();
    try {
      return Graph.getOauthUrl({
        ...config,
        scope: this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.SCOPE') as string,
      });
    } catch (error) {
      LoggerUtil.logInfo(error);
    }
  }

  authorizeFacebook(code: string): Observable<I_FB_AUTH_RESPONSE> {
    const config = this.getFacebookSettings();
    return from(
      Graph.authorizeAsync({
        ...config,
        client_secret: this.configService.get<string>('SOCIAL_PLATFORM.FACEBOOK.CLIENT_SECRET') as string,
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
      fields: 'picture{url},name,category,id,access_token',
    };

    return from(Graph.getAsync('me/accounts', params)).pipe(
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
}
