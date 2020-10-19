import { AuthGuard } from '@guards';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Response,
  UseGuards
} from '@nestjs/common';
import { PostDto } from '@dtos';
import { PostFacade } from '../facade/post.facade';
import type { FastifyReply } from 'fastify';
import type { IPost } from '@interfaces';

@Controller('')
export class PostController {
  constructor (private readonly facade: PostFacade) {}

  @Get(':post_user_id')
  @UseGuards(AuthGuard)
  public async getPostsByUserID (@Param('post_user_id') post_user_id: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const posts: IPost[] = await this.facade.getPostsByUserID(post_user_id);

    response.
      header('x-response-time', response_time).
      type('application/json').
      status(HttpStatus.OK).
      send(posts);
  }

  @Post('text-facebook-published')
  @UseGuards(AuthGuard)
  public async publishFacebookText (@Body() add_post_dto: PostDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const published_post: IPost = await this.facade.publishFacebookText(add_post_dto);

    response.
      header('x-response-time', response_time).
      type('application/json').
      status(HttpStatus.OK).
      send(published_post);
  }

  @Post('text-linkedin-published')
  @UseGuards(AuthGuard)
  public async publishLinkedinText (@Body() add_post_dto: PostDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const published_post: IPost = await this.facade.publishLinkedInText(add_post_dto);

    response.
      header('x-response-time', response_time).
      type('application/json').
      status(HttpStatus.OK).
      send(published_post);
  }

  @Post('text-facebook-scheduled')
  @UseGuards(AuthGuard)
  public async scheduleFacebookText (@Body() add_post_dto: PostDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const scheduled_post: IPost = await this.facade.scheduleFacebookText(add_post_dto);

    response.
      header('x-response-time', response_time).
      type('application/json').
      status(HttpStatus.OK).
      send(scheduled_post);
  }
}
