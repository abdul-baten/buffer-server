import { AuthGuard } from '@guards';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Response,
  UseGuards
} from '@nestjs/common';
import { FacebookService } from '../service/facebook.service';
import type { FastifyReply } from 'fastify';
import type { IConnection, IFbAuthResponse } from '@interfaces';

@Controller('')
export class FacebookController {
  constructor (private readonly profileService: FacebookService) {}

  @Get('authorize')
  @UseGuards(AuthGuard)
  public async facebookAuth (@Query('connection_type') connection_type: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const redirect_uri: string = await this.profileService.authenticateFacebook(connection_type);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.MOVED_PERMANENTLY).
      redirect(redirect_uri);
  }

  @Get('facebook-pages')
  @UseGuards(AuthGuard)
  public async getFBPages (@Query('code') code: string, @Query('connection_type') connection_type: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const auth_response: IFbAuthResponse = await this.profileService.authorizeFacebook(code, connection_type);
    const facebook_pages: IConnection[] = await this.profileService.getFBPages(auth_response);

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
    const auth_response: IFbAuthResponse = await this.profileService.authorizeFacebook(code, connection_type);
    const facebook_groups: IConnection[] = await this.profileService.getFBGroups(auth_response);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(facebook_groups);
  }
}
