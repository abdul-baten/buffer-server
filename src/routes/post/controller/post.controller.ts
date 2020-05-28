import { AuthGuard } from '@app/guards/auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { I_POST_FILE } from '@app/interface';
import { Observable } from 'rxjs';
import { PostFacade } from '../facade/post.facade';
import { Request } from 'express';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';

export const postMediaFileName = (_req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0].toLowerCase();
  const fileExtName = extname(file.originalname);
  const randomName = Date.now();
  callback(null, `${name}-${randomName}${fileExtName}`);
};

@Controller('')
export class PostController {
  constructor(private readonly postFacade: PostFacade) {}

  @Post('add')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('postMedia', {
      storage: diskStorage({
        destination: './upload',
        filename: postMediaFileName,
      }),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  addPost(
    @Req() request: Request,
    @UploadedFile() postMedia: any,
  ): Observable<I_POST_FILE> {
    const { authToken } = request.cookies;
    return this.postFacade.addFile(authToken, postMedia);
  }
}
