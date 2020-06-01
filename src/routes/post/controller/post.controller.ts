import { AuthGuard } from '@guards';
import { extname } from 'path';
import { I_POST } from '@interfaces';
import { Observable } from 'rxjs';
import { PostDTO } from '@dtos';
import { PostFacade } from '../facade/post.facade';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Body,
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

  // @Post('add')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(
  //   FileInterceptor('postMedia', {
  //     storage: diskStorage({
  //       destination: './upload',
  //       filename: postMediaFileName,
  //     }),
  //   }),
  // )
  // @HttpCode(HttpStatus.CREATED)
  // addPost(
  //   @Req() request: Request,
  //   @UploadedFile() postMedia: any,
  // ): Observable<I_POST_FILE> {
  //   const { authToken } = request.cookies;
  //   return this.postFacade.addFile(authToken, postMedia);
  // }

  @Post('add')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  addPost(@Body() addPostDTO: PostDTO): Observable<I_POST> {
    return this.postFacade.addPost(addPostDTO);
  }
}
