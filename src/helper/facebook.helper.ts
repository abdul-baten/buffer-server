import { catchError, map, switchMap } from 'rxjs/operators';
import { ErrorHelper } from './error.helper';
import { forkJoin, from, of } from 'rxjs';
import { I_FB_STATUS_SUCCESS } from '@interfaces';
import { PostDTO } from '@dtos';
import { promisifyAll } from 'bluebird';
import requestPromise = require('request-promise');

const Graph = require('fbgraph');
promisifyAll(Graph);

export class FacebookHelper {
  static async postStatus(connectionID: string, connectionToken: string, postCaption: string): Promise<I_FB_STATUS_SUCCESS> {
    const params = {
      message: postCaption,
      access_token: connectionToken,
    };

    return from(Graph.postAsync(`${connectionID}/feed`, params))
      .pipe(
        map((response: I_FB_STATUS_SUCCESS) => response),
        catchError(error => ErrorHelper.catchFBError(error)),
      )
      .toPromise();
  }

  static async getPublishedMediaIDs(postInfo: PostDTO, connectionID: string, connectionToken: string): Promise<any[]> {
    try {
      const parallelRequests: any[] = [];

      for (let _ of postInfo.postMedia) {
        const getIdApiParams = {
          method: 'POST',
          uri: `https://graph.facebook.com/${connectionID}/photos`,
          qs: {
            access_token: connectionToken,
            published: false,
            url: 'https://images.unsplash.com/photo-1590931743459-ae6695ba1fe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          },
        };
        parallelRequests.push(of(JSON.parse(await requestPromise(getIdApiParams))));
      }

      return parallelRequests;
    } catch (error) {
      return ErrorHelper.catchFBError(JSON.parse(error.error).error).toPromise();
    }
  }

  static async postImages(connectionID: string, connectionToken: string, postInfo: PostDTO): Promise<I_FB_STATUS_SUCCESS> {
    const postParams$ = await this.getPublishedMediaIDs(postInfo, connectionID, connectionToken);

    return (forkJoin(...postParams$)
      .pipe(
        map(([...responses]) => {
          let postParams: any = {
            access_token: connectionToken,
            message: postInfo.postCaption,
          };
          const mediasIDs = [...responses];
          mediasIDs.forEach((mediaId: I_FB_STATUS_SUCCESS, index: number) => {
            postParams[`attached_media[${index}]`] = { media_fbid: mediaId.id };
          });
          return postParams;
        }),
        switchMap((postParams: Record<string, string>) => {
          return from(Graph.postAsync(`${connectionID}/feed`, postParams));
        }),
        catchError(error => ErrorHelper.catchFBError(error)),
      )
      .toPromise() as unknown) as I_FB_STATUS_SUCCESS;
  }

  static async postVideo(connectionID: string, connectionToken: string, postInfo: PostDTO): Promise<I_FB_STATUS_SUCCESS> {
    const getIdApiParams = {
      method: 'POST',
      uri: `https://graph-video.facebook.com/${connectionID}/videos`,
      qs: {
        access_token: connectionToken,
        description: postInfo.postCaption,
        file_url: 'https://static.videezy.com/system/resources/previews/000/011/317/original/openning_small_can.mp4',
      },
    };

    return from(requestPromise(getIdApiParams))
      .pipe(
        map((response: any) => response),
        catchError(error => {
          return ErrorHelper.catchFBError(JSON.parse(error.error).error);
        }),
      )
      .toPromise();
  }
}
