import { AuthGuard } from '@guards';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Response,
  UseGuards
} from '@nestjs/common';
import { FacebookFacade } from '../facade/facebook.facade';
import type { FastifyReply } from 'fastify';
import type { IConnection, IRedirectResponse, IFbAuthResponse } from '@interfaces';

@Controller('')
export class FacebookController {
  constructor (private readonly facade: FacebookFacade) {}

  @Get('authorize')
  @UseGuards(AuthGuard)
  public facebookAuth (@Query('connection_type') connection_type: string, @Response() response: FastifyReply): void {
    const response_time: number = response.getResponseTime();
    const redirect_uri = this.facade.authenticateFacebook(connection_type);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(redirect_uri as IRedirectResponse);
  }

  @Get('facebook-pages')
  @UseGuards(AuthGuard)
  public async getFBPages (@Query('code') code: string, @Query('connection_type') connection_type: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const { access_token }: IFbAuthResponse = await this.facade.authorizeFacebook(code, connection_type);
    const facebook_pages: IConnection[] = await this.facade.getFBPages(access_token);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(facebook_pages);
  }

  @Get('facebook-groups')
  @UseGuards(AuthGuard)
  public async getFBGroups (@Query('code') code: string, @Query('connection_type') connection_type: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const { access_token }: IFbAuthResponse = await this.facade.authorizeFacebook(code, connection_type);
    const facebook_groups: IConnection[] = await this.facade.getFacebookGroups(access_token);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(facebook_groups);
  }
}
