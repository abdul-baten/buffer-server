import { AuthGuard } from '@guards';
import { Controller, Get, HttpCode, HttpStatus, Query, Redirect, UseGuards } from '@nestjs/common';
import { I_CONNECTION } from '@interfaces';
import { TwitterFacade } from '../facade/twitter.facade';

@Controller('')
export class TwitterController {
  constructor(private readonly twitterFacade: TwitterFacade) {}

  @Get('authorize')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @Redirect('')
  async twitterAuth() {
    const redirectUrl = await this.twitterFacade.authorize();
    return { url: redirectUrl };
  }

  @Get('accessToken')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAccessToken(@Query('oauth_token') oauth_token: string, @Query('oauth_verifier') oauth_verifier: string): Promise<I_CONNECTION> {
    return this.twitterFacade.getProfile(oauth_token, oauth_verifier);
  }
}
