import { AxiosError } from 'axios';
import { catchError, map, switchMap } from 'rxjs/operators';
import { E_CONNECTION_TYPE, E_ERROR_MESSAGE, E_ERROR_MESSAGE_MAP, E_POST_STATUS, E_POST_TYPE } from '@enums';
import { FacebookHelper, LinkedInHelper, TwitterHelper } from '@helpers';
import { forkJoin, from, Observable, of } from 'rxjs';
import { I_CONNECTION, I_POST } from '@interfaces';
import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { PostDTO } from '@dtos';
import { PostMapper } from '@mappers';
import { PostService } from '../service/post.service';
import { SanitizerUtil } from '@utils';

@Injectable()
export class PostFacade {
  constructor(private readonly postService: PostService) {}

  async addPost(postInfo: PostDTO): Promise<I_POST> {
    const postRequest$ = this.postService.addPost(postInfo).pipe(
        map((postInfo: I_POST) => SanitizerUtil.sanitizedResponse(postInfo)),
        map((post: I_POST) => PostMapper.postResponseMapper(post)),
      ),
      { postConnection, postType, postStatus } = postInfo;

    const { connectionID, connectionType, connectionToken } = await this.postService.getConnection(postConnection.id as string);

    const connectionRequest$ = from(
      this.postToConnections(connectionID as string, connectionType as E_CONNECTION_TYPE, connectionToken as string, postType, postStatus, postInfo),
    );

    return forkJoin([connectionRequest$, postRequest$])
      .pipe(
        map(([_res, post]) => {
          return post;
        }),
        catchError(error => {
          console.warn(error);

          throw new UnprocessableEntityException(E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.ADD_POST_ERROR));
        }),
      )
      .toPromise();
  }

  getPosts(userID: string): Observable<I_POST[]> {
    return this.postService.getPosts(userID).pipe(
      map((posts: I_POST[]) => {
        return posts.map((post: I_POST) => SanitizerUtil.sanitizedResponse(post));
      }),
      map((connections: I_POST[]) => {
        return connections.map((connection: I_POST) => PostMapper.postResponseMapper(connection));
      }),
      map((connections: I_POST[]) => connections),
      catchError(error => {
        throw new InternalServerErrorException(error);
      }),
    );
  }

  async postToConnections(
    connectionID: string,
    connectionType: E_CONNECTION_TYPE,
    connectionToken: string,
    postType: E_POST_TYPE,
    postStatus: E_POST_STATUS,
    postInfo: PostDTO,
  ): Promise<any> {
    let connectionRequest$: Observable<any> = of(null);
    if (postType === E_POST_TYPE.IMAGE) {
      if (postStatus === E_POST_STATUS.PUBLISHED) {
        switch (connectionType) {
          case E_CONNECTION_TYPE.FACEBOOK_PAGE:
          case E_CONNECTION_TYPE.FACEBOOK_GROUP:
            connectionRequest$ = from(FacebookHelper.postImages(connectionID, connectionToken, postInfo)).pipe(map((response: any) => response));
            break;

          case E_CONNECTION_TYPE.LINKEDIN_PAGE:
          case E_CONNECTION_TYPE.LINKEDIN_PROFILE:
            connectionRequest$ = from(LinkedInHelper.postProfileMedia(postInfo, connectionID, connectionToken)).pipe(
              map((response: any) => response),
            );
            break;

          case E_CONNECTION_TYPE.TWITTER:
            connectionRequest$ = from(TwitterHelper.postImages(postInfo, connectionToken)).pipe(map((response: any) => response));
            break;

          default:
            connectionRequest$ = of(null);
            break;
        }
      }
    } else if (postType === E_POST_TYPE.VIDEO) {
      if (postStatus === E_POST_STATUS.PUBLISHED) {
        switch (connectionType) {
          case E_CONNECTION_TYPE.FACEBOOK_PAGE:
          case E_CONNECTION_TYPE.FACEBOOK_GROUP:
            connectionRequest$ = from(FacebookHelper.postVideo(connectionID, connectionToken, postInfo)).pipe(map((response: any) => response));
            break;

          case E_CONNECTION_TYPE.LINKEDIN_PAGE:
          case E_CONNECTION_TYPE.LINKEDIN_PROFILE:
            connectionRequest$ = from(LinkedInHelper.postProfileVideo(postInfo, connectionID, connectionToken)).pipe(
              map((response: any) => response),
            );
            break;

          case E_CONNECTION_TYPE.TWITTER:
            connectionRequest$ = from(TwitterHelper.postVideos(postInfo, connectionToken)).pipe(map((response: any) => response));
            break;

          default:
            connectionRequest$ = of(null);
            break;
        }
      }
    } else {
      if (postStatus === E_POST_STATUS.PUBLISHED) {
        switch (connectionType) {
          case E_CONNECTION_TYPE.FACEBOOK_PAGE:
          case E_CONNECTION_TYPE.FACEBOOK_GROUP:
            connectionRequest$ = from(FacebookHelper.postStatus(connectionID, connectionToken, postInfo.postCaption, E_POST_STATUS.PUBLISHED, '')).pipe(
              map((response: any) => response),
            );
            break;

          case E_CONNECTION_TYPE.LINKEDIN_PAGE:
          case E_CONNECTION_TYPE.LINKEDIN_PROFILE:
            connectionRequest$ = from(LinkedInHelper.postProfileStatus(connectionID, connectionToken, postInfo.postCaption)).pipe(
              map((response: any) => response),
            );
            break;

          case E_CONNECTION_TYPE.TWITTER:
            connectionRequest$ = from(TwitterHelper.postStatus(postInfo.postCaption, connectionToken)).pipe(map((response: any) => response));
            break;

          default:
            connectionRequest$ = of(null);
            break;
        }
      } else {
        connectionRequest$ = of(null);
      }
    }

    return connectionRequest$.toPromise();
  }

  publishFacebookText(postInfo: PostDTO): Observable<I_POST> {
    const {
      postCaption,
      postStatus,
      postScheduleDateTime,
      postConnection: { id },
    } = postInfo;
    const connection$ = from(this.postService.getConnection(id as string));
    return connection$.pipe(
      switchMap(({ connectionID = '', connectionToken = '' }: I_CONNECTION) => {
        return this.postService.postFacebookStatus(connectionID as string, connectionToken as string, postCaption, postStatus, postScheduleDateTime);
      }),
      map(() => (postInfo as unknown) as I_POST),
      catchError((error: AxiosError) => {
        throw new UnprocessableEntityException({
          errorCode: error.response?.status,
          errorDetails: error.response?.data,
          httpCode: E_ERROR_MESSAGE.ADD_POST_ERROR,
          message: E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.ADD_POST_ERROR),
        });
      }),
    );
  }

  scheduleFacebookText(postInfo: PostDTO): Observable<I_POST> {
    const {
      postCaption,
      postStatus,
      postScheduleDateTime,
      postConnection: { id },
    } = postInfo;
    const connection$ = from(this.postService.getConnection(id as string));
    return connection$.pipe(
      switchMap(({ connectionID = '', connectionToken = '' }: I_CONNECTION) => {
        return this.postService.postFacebookStatus(connectionID as string, connectionToken as string, postCaption, postStatus, postScheduleDateTime);
      }),
      map(() => (postInfo as unknown) as I_POST),
      catchError((error: AxiosError) => {
        throw new UnprocessableEntityException({
          errorCode: error.response?.status,
          errorDetails: error.response?.data,
          httpCode: E_ERROR_MESSAGE.ADD_POST_ERROR,
          message: E_ERROR_MESSAGE_MAP.get(E_ERROR_MESSAGE.ADD_POST_ERROR),
        });
      }),
    );
  }
}
