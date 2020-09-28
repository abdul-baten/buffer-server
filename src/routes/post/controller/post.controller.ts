import { AuthGuard } from '@guards';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { I_POST } from '@interfaces';
import { PostDTO } from '@dtos';
import { PostFacade } from '../facade/post.facade';

@Controller('')
export class PostController {
  constructor(private readonly postFacade: PostFacade) {}

  @Post('add')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  addPost(@Body() addPostDTO: PostDTO): Observable<I_POST> {
    return from(this.postFacade.addPost(addPostDTO));
  }

  @Post('text-facebook-published')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  publishFacebookText(@Body() addPostDTO: PostDTO): Observable<I_POST> {
    return from(this.postFacade.publishFacebookText(addPostDTO));
  }

  @Post('text-facebook-scheduled')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  scheduleFacebookText(@Body() addPostDTO: PostDTO): Observable<I_POST> {
    return from(this.postFacade.scheduleFacebookText(addPostDTO));
  }

  @Get('posts')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getPosts(@Query('userID') userID: string): Observable<I_POST[]> {
    return this.postFacade.getPosts(userID);
  }
}
