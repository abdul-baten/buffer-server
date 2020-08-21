import { catchError, map, switchMap } from 'rxjs/operators';
import { configuration } from '@config';
import { createReadStream, readFileSync, statSync } from 'fs';
import { E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP, E_TW_UPLOAD_COMMAND } from '@enums';
import { FileTypeResult, fromStream } from 'file-type';
import { forkJoin, from, Observable, of } from 'rxjs';
import { get, post } from 'request-promise';
import { I_TW_ACCESS_TOKEN_RESPONSE, I_TW_ERROR_RESPONSE, I_TW_MEDIA_UPLOAD_RESPONSE } from '@interfaces';
import { InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import { parse } from 'query-string';
import { PostDTO } from '@dtos';
import Twitter = require('twitter');

export class TwitterHelper {
  private static API_KEY = configuration.default.SOCIAL_PLATFORM.TWITTER.API_KEY;
  private static API_SECRET = configuration.default.SOCIAL_PLATFORM.TWITTER.API_SECRET;
  private static ACCESS_TOKEN = configuration.default.SOCIAL_PLATFORM.TWITTER.ACCESS_TOKEN;
  private static ACCESS_TOKEN_SECRET = configuration.default.SOCIAL_PLATFORM.TWITTER.ACCESS_TOKEN_SECRET;

  static async authorize(): Promise<string> {
    const profileInfoRequest = await post('https://api.twitter.com/oauth/request_token', {
      oauth: {
        consumer_key: this.API_KEY,
        consumer_secret: this.API_SECRET,
        token: this.ACCESS_TOKEN,
        token_secret: this.ACCESS_TOKEN_SECRET,
      },
    });

    return `https://api.twitter.com/oauth/authorize?${profileInfoRequest}`;
  }

  private static async getAccessToken(oauth_token: string, oauth_verifier: string): Promise<I_TW_ACCESS_TOKEN_RESPONSE> {
    const getAccessTokenParams = await post('https://api.twitter.com/oauth/access_token', {
      qs: {
        oauth_consumer_key: this.API_KEY,
        oauth_token,
        oauth_verifier,
      },
      json: true,
    });

    const accessTokenResponse: I_TW_ACCESS_TOKEN_RESPONSE = (parse(getAccessTokenParams) as unknown) as I_TW_ACCESS_TOKEN_RESPONSE;
    return accessTokenResponse;
  }

  private static async getProfileInfoFromToken(user_id: string, screen_name: string): Promise<any> {
    const profileInfoRequest = get('https://api.twitter.com/1.1/users/show.json', {
      oauth: {
        consumer_key: this.API_KEY,
        consumer_secret: this.API_SECRET,
        token: this.ACCESS_TOKEN,
        token_secret: this.ACCESS_TOKEN_SECRET,
      },
      qs: {
        user_id: user_id,
        screen_name: screen_name,
      },
    });

    return profileInfoRequest;
  }

  static async getProfile(oauth_token: string, oauth_verifier: string): Promise<any> {
    const { user_id, screen_name, oauth_token: token, oauth_token_secret } = await this.getAccessToken(oauth_token, oauth_verifier);
    const profileInfoFromToken = this.getProfileInfoFromToken(user_id, screen_name);

    return from(profileInfoFromToken)
      .pipe(
        map((response: any) => {
          return { response, token, oauth_token_secret };
        }),
        catchError(error => {
          return error;
        }),
      )
      .toPromise();
  }

  private static async postTwitterStatus(postCaption: string, connectionToken: string, media_ids: string = ''): Promise<any> {
    const oauthTokenArray = connectionToken.split(','),
      token = oauthTokenArray[0],
      token_secret = oauthTokenArray[1];

    const statusResponse = post('https://api.twitter.com/1.1/statuses/update.json', {
      oauth: {
        consumer_key: this.API_KEY,
        consumer_secret: this.API_SECRET,
        token,
        token_secret,
      },
      qs: {
        status: postCaption,
        media_ids,
      },
      json: true,
    });

    return from(statusResponse)
      .pipe(
        catchError(error => {
          console.warn('error', error);
          return this.catchTwitterError(error);
        }),
      )
      .toPromise();
  }

  static async postStatus(postCaption: string, connectionToken: string): Promise<any> {
    const statusResponse = this.postTwitterStatus(postCaption, connectionToken);

    return from(statusResponse)
      .pipe(catchError(error => this.catchTwitterError(error.errors[0])))
      .toPromise();
  }

  static async getPublishedMediaIDs(postInfo: PostDTO, connectionToken: string): Promise<any[]> {
    try {
      const oauthTokenArray = connectionToken.split(','),
        token = oauthTokenArray[0],
        token_secret = oauthTokenArray[1];

      const parallelRequests: any[] = [];

      const client = new Twitter({
        consumer_key: configuration.default.SOCIAL_PLATFORM.TWITTER.API_KEY,
        consumer_secret: configuration.default.SOCIAL_PLATFORM.TWITTER.API_SECRET,
        access_token_key: token,
        access_token_secret: token_secret,
      });

      for (let postMedia of postInfo.postMedia) {
        const media = readFileSync(join(process.cwd(), 'upload', postMedia));
        const { media_id_string } = (await client.post('media/upload', { media })) as I_TW_MEDIA_UPLOAD_RESPONSE;

        parallelRequests.push(of(media_id_string));
      }

      return parallelRequests;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  static async postImages(postInfo: PostDTO, connectionToken: string): Promise<any> {
    const postParams$ = await this.getPublishedMediaIDs(postInfo, connectionToken);

    return forkJoin(...postParams$)
      .pipe(
        map(([...responses]) => {
          const media_ids = responses.toString();
          return media_ids;
        }),
        switchMap((media_ids: string) => from(this.postTwitterStatus(postInfo.postCaption, connectionToken, media_ids))),
        catchError(error => {
          console.warn(error);
          return this.catchTwitterError(error.errors[0]);
        }),
      )
      .toPromise();
  }

  private static async publishStatusUpdate(mediaId: string, postCaption: string, connectionToken: string): Promise<any> {
    const response = this.postTwitterStatus(postCaption, connectionToken, mediaId);
    return from(response).toPromise();
  }

  private static async finalizeUpload(twitterClient: Twitter, mediaId: string): Promise<void> {
    await twitterClient.post('media/upload', {
      command: E_TW_UPLOAD_COMMAND.FINALIZE,
      media_id: mediaId,
    });
  }

  private static async appendFileChunk(twitterClient: Twitter, mediaId: string, mediaData: Buffer): Promise<void> {
    await twitterClient.post('media/upload', {
      command: E_TW_UPLOAD_COMMAND.APPEND,
      media_id: mediaId,
      media: mediaData,
      segment_index: 0,
    });
  }

  private static async initializeMediaUpload(twitterClient: Twitter, mediaSize: number, mediaType: any): Promise<string> {
    const initializeResponse = twitterClient.post('media/upload', {
      command: E_TW_UPLOAD_COMMAND.INIT,
      total_bytes: mediaSize,
      media_type: mediaType,
    });

    return from(initializeResponse)
      .pipe(map((resp: I_TW_MEDIA_UPLOAD_RESPONSE) => resp.media_id_string))
      .toPromise();
  }

  static async postVideos(postInfo: PostDTO, connectionToken: string): Promise<any> {
    const oauthTokenArray = connectionToken.split(','),
      token = oauthTokenArray[0],
      token_secret = oauthTokenArray[1];

    const twitterClient = new Twitter({
      consumer_key: configuration.default.SOCIAL_PLATFORM.TWITTER.API_KEY,
      consumer_secret: configuration.default.SOCIAL_PLATFORM.TWITTER.API_SECRET,
      access_token_key: token,
      access_token_secret: token_secret,
    });

    const media = join(process.cwd(), 'upload', postInfo.postMedia[0]);
    const mediaData = readFileSync(media);
    const mediaSize = statSync(media).size;
    const { mime: mediaType } = (await fromStream(createReadStream(media))) as FileTypeResult;

    const mediaId = await this.initializeMediaUpload(twitterClient, mediaSize, mediaType);
    await this.appendFileChunk(twitterClient, mediaId, mediaData);
    await this.finalizeUpload(twitterClient, mediaId);
    const postVideosResponse = this.publishStatusUpdate(mediaId, postInfo.postCaption, connectionToken);

    return from(postVideosResponse)
      .pipe(
        map(response => response),
        catchError(error => {
          return this.catchTwitterError(error[0]);
        }),
      )
      .toPromise();
  }

  private static catchTwitterError(error: I_TW_ERROR_RESPONSE): Observable<any> {
    switch (error.code) {
      case 32:
        throw new InternalServerErrorException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.TW_AUTHENTICATE_ERROR), E_ERROR_MESSAGE.TW_AUTHENTICATE_ERROR);

      case 324:
        throw new InternalServerErrorException(
          E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.TW_INVALID_MEDIA_ERROR),
          E_ERROR_MESSAGE.TW_INVALID_MEDIA_ERROR,
        );

      default:
        throw new InternalServerErrorException(error.message);
    }
  }
}
