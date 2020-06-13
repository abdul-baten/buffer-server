import { AddConnectionDTO } from '@dtos';
import { AuthGuard } from '@guards';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Redirect, UseGuards } from '@nestjs/common';
import { I_CONNECTION, I_LN_ACCESS_TOKEN_RESPONSE } from '@interfaces';
import { LinkedInFacade } from '../facade/linkedin.facade';
import { Observable } from 'rxjs';

@Controller('')
export class LinkedInController {
  constructor(private readonly linkedInFacade: LinkedInFacade) {}

  @Get('authorize')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @Redirect('')
  authorize(@Query('connectionType') connectionType: string): { url: string } {
    const redirectUrl = this.linkedInFacade.authorize(connectionType);
    return { url: redirectUrl };
  }

  @Get('access-token')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getAccessToken(@Query('connectionType') connectionType: string, @Query('code') code: string): Observable<I_LN_ACCESS_TOKEN_RESPONSE> {
    const accessTokenResponse$ = this.linkedInFacade.getAccessToken(connectionType, code);
    return accessTokenResponse$;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getUserInfo(@Query('accessToken') accessToken: string): Observable<I_CONNECTION> {
    const userInfoResponse$ = this.linkedInFacade.getUserInfo(accessToken);
    return userInfoResponse$;
  }

  @Post('profile')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  addLinkedInProfile(@Body() addFBPageDTO: AddConnectionDTO): Observable<I_CONNECTION> {
    return this.linkedInFacade.addLinkedInProfile(addFBPageDTO);
  }
}
