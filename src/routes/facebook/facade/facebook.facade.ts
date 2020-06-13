import { AddConnectionDTO } from '@dtos';
import { catchError, defaultIfEmpty, map, pluck } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { ConnectionMapper } from '@mappers';
import { E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP } from '@enums';
import { from, Observable } from 'rxjs';
import { I_CONNECTION, I_FB_AUTH_ERROR, I_FB_AUTH_RESPONSE, I_FB_PAGE } from '@interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoggerUtil, SanitizerUtil } from '@utils';
import { Model } from 'mongoose';
import { promisifyAll } from 'bluebird';

const Graph = require('fbgraph');
Graph.setVersion('6.0');

promisifyAll(Graph);

@Injectable()
export class FacebookFacade {
  constructor(
    private configService: ConfigService,
    @InjectModel('Connection')
    private readonly connectionModel: Model<I_CONNECTION>,
  ) {}

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
      catchError((error: I_FB_AUTH_ERROR) => this.catchFBError(error)),
    );
  }

  private getFacebookPages(accessToken: string): Observable<any> {
    const params = {
      access_token: accessToken,
      fields: 'picture{url},name,category,id,access_token',
    };

    return from(Graph.getAsync('me/accounts', params)).pipe(
      map(response => response),
      catchError((error: I_FB_AUTH_ERROR) => this.catchFBError(error)),
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
      catchError((error: I_FB_AUTH_ERROR) => this.catchFBError(error)),
    );
  }

  addFBPage(addFBPageDTO: AddConnectionDTO): Observable<I_CONNECTION> {
    const connection = new this.connectionModel(addFBPageDTO);
    return from(connection.save()).pipe(
      map((connection: I_CONNECTION) => SanitizerUtil.sanitizedResponse(connection)),
      map((connection: I_CONNECTION) => connection),
      catchError(error => {
        throw new InternalServerErrorException(error);
      }),
    );
  }

  catchFBError(error: I_FB_AUTH_ERROR): Observable<any> {
    LoggerUtil.logError(JSON.stringify(error));
    switch (error.code) {
      case 100:
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR),
          E_ERROR_MESSAGE.FB_AUTH_CODE_EXPIRED_ERROR,
        );

      case 191:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_RIDERECT_URI_ERROR), E_ERROR_MESSAGE.FB_RIDERECT_URI_ERROR);

      default:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.FB_OAUTH_ERROR), E_ERROR_MESSAGE.FB_OAUTH_ERROR);
    }
  }
}
