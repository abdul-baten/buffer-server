import { ConfigService } from '@nestjs/config';
import { E_CONNECTION_TYPE } from '@enums';
import { from, Observable } from 'rxjs';
import { I_POST, I_POST_FILE, I_USER } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { map, switchMap, tap } from 'rxjs/operators';
import { PostDTO } from '@dtos';
import { PostService } from '../service/post.service';
import { promisifyAll } from 'bluebird';
import { SanitizerUtil, TokenUtil } from '@utils';

const Graph = require('fbgraph');
promisifyAll(Graph);

@Injectable()
export class PostFacade {
  constructor(
    private readonly configService: ConfigService,
    private readonly postService: PostService,
  ) {}

  addFile(authToken: string, postMedia: any): Observable<I_POST_FILE> {
    const userID$ = this.verifyToken(authToken);

    const { filename: fileName, mimetype: fileMimeType } = postMedia;
    const fileType = fileMimeType.split('/')[0];
    const fileURL = fileName;

    return userID$.pipe(
      switchMap((userInfo: I_USER) => {
        const { _id: userID } = userInfo;
        return this.postService.addFile({
          fileType,
          fileURL,
          fileName,
          fileMimeType,
          userID,
        });
      }),
      map((fileInfo: I_POST_FILE) => SanitizerUtil.sanitizedResponse(fileInfo)),
      map((fileInfo: I_POST_FILE) => fileInfo),
    );
  }

  addPost(postBody: PostDTO): Observable<I_POST> {
    return this.postService.addPost(postBody).pipe(
      tap((postInfo: I_POST) => {
        const connections = postInfo.postConnection;
        connections.map(async (id: string) => {
          const connectionInfo = await this.postService.getConnection(id);

          const {
            connectionID,
            connectionToken,
            connectionType,
          } = connectionInfo;

          switch (connectionType) {
            case E_CONNECTION_TYPE.FACEBOOK_PAGE:
              this.postFacebookStatus(
                connectionID,
                connectionToken,
                postInfo.postCaption,
              );
              break;
          }
        });
      }),
    );
  }

  verifyToken(authToken: string): Observable<Partial<I_USER>> {
    return from(TokenUtil.verifyUser(authToken, this.configService));
  }

  postFacebookStatus(
    connectionID: string,
    connectionToken: string,
    postCaption: string,
  ) {
    const params = {
      message: postCaption,
      access_token: connectionToken,
    };

    Graph.postAsync(`${connectionID}/feed`, params);
  }
}
