import { AuthGuard } from '@guards';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Response,
  UseGuards
} from '@nestjs/common';
import { TwitterFacade } from '../facade/twitter.facade';
import type { FastifyReply } from 'fastify';
import type { IConnection } from '@interfaces';

@Controller('')
export class TwitterController {
  constructor (private readonly facade: TwitterFacade) {}

  @Get('authorize')
  @UseGuards(AuthGuard)
  async twitterAuth (@Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const redirect_uri: string = await this.facade.authorize();

    response.
      header('x-response-time', response_time).
      status(HttpStatus.MOVED_PERMANENTLY).
      redirect(redirect_uri);
  }

  @Get('access_token')
  @UseGuards(AuthGuard)
  async getAccessToken (@Query('oauth_token') oauth_token: string, @Query('oauth_verifier') oauth_verifier: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const access_token: IConnection = await this.facade.getProfile(oauth_token, oauth_verifier);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(access_token);
  }
}
