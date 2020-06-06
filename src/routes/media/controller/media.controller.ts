import { AuthGuard } from '@guards';
import { configuration } from '@config';
import { Controller, Delete, HttpCode, HttpStatus, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { I_MEDIA } from '@interfaces';
import { MediaFacade } from '../facade/media.facade';
import { Observable } from 'rxjs';
import { Request } from 'express';

const UPLOAD_DIR = configuration.default.APP.UPLOAD_DIR;

export const postMediaFileName = (_req: any, file: any, callback: any) => {
  const name = file.originalname.split('.')[0].toLowerCase();
  const fileExtName = extname(file.originalname);
  const randomName = Date.now();
  callback(null, `${name}-${randomName}${fileExtName}`);
};

@Controller('')
export class MediaController {
  constructor(private readonly mediaFacade: MediaFacade) {}

  @Post('add')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('postMedia', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: postMediaFileName,
      }),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  addMedia(@Req() request: Request, @UploadedFile() postMedia: any): Observable<I_MEDIA> {
    const { authToken } = request.cookies;
    return this.mediaFacade.addMedia(authToken, postMedia);
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteMedia(@Query('deletedID') deletedID: string): Observable<I_MEDIA> {
    return this.mediaFacade.deleteMedia(deletedID);
  }
}
