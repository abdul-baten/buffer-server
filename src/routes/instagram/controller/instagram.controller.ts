import { AuthGuard } from '@guards';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Response,
  UseGuards
} from '@nestjs/common';
import { InstagramFacade } from '../facade/instagram.facade';
import type { FastifyReply } from 'fastify';

@Controller('')
export class InstagramController {
  constructor (private readonly facade: InstagramFacade) {}

  @Get('authorize')
  @UseGuards(AuthGuard)
  public async facebookAuth (@Query('connection_type') connection_type: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const redirect_uri: string = await this.facade.authenticateInstagram(connection_type);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.MOVED_PERMANENTLY).
      redirect(redirect_uri);
  }

  @Get('instagram-business')
  @UseGuards(AuthGuard)
  public async instagramAccounts (@Query('code') code: string, @Query('connection_type') connection_type: string, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const auth_response = await this.facade.authorizeInstagram(code, connection_type);
    const business_accounts = this.facade.businessAccounts(auth_response);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(business_accounts);
  }
}
