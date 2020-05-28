import { ConfigService } from '@nestjs/config';
import { from, Observable } from 'rxjs';
import { I_POST_FILE, I_USER } from '@app/interface';
import { Injectable } from '@nestjs/common';
import { PostDTO } from '../dto/post.dto';
import { PostService } from '../service/post.service';
import { TokenUtil } from '@app/util';
import { switchMap, map } from 'rxjs/operators';
import { SanitizerUtil } from '@app/util/sanitizer/sanitizer.util';

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
      map((fileInfo: I_POST_FILE) =>
        SanitizerUtil.sanitizedResponse(fileInfo),
      ),
      map((fileInfo: I_POST_FILE) => fileInfo),
    );
  }

  addPost(postBody: PostDTO) {
    this.postService.addPost(postBody);
  }

  verifyToken(authToken: string): Observable<Partial<I_USER>> {
    return from(TokenUtil.verifyUser(authToken, this.configService));
  }
}
