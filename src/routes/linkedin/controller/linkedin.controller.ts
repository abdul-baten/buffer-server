import { AuthGuard } from '@guards';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Response,
  UseGuards
} from '@nestjs/common';
import { LinkedInFacade } from '../facade/linkedin.facade';
import type { FastifyReply } from 'fastify';

@Controller('')
export class LinkedInController {
  constructor (private readonly facade: LinkedInFacade) {}

  @Get('authorize')
  @UseGuards(AuthGuard)
  public async authorize (@Query('connection_type') connection_type: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const redirect_uri: string = await this.facade.authorize(connection_type);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.MOVED_PERMANENTLY).
      redirect(redirect_uri);
  }

  @Get('access-token')
  @UseGuards(AuthGuard)
  public async accessToken (@Query('connection_type') connection_type: string, @Query('code') code: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const access_token: string = await this.facade.getAccessToken(connection_type, code);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('plain/text').
      send(access_token);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  public async userInfo (@Query('connection_token') connection_token: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const user_info = await this.facade.getUserInfo(connection_token);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(user_info);
  }

  @Get('organisations')
  @UseGuards(AuthGuard)
  public async userOrgs (@Query('access_token') access_token: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const organisations = await this.facade.getUserOrgs(access_token);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(organisations);
  }
}
