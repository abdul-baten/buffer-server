import { AddConnectionDTO } from '@dtos';
import { AuthGuard } from '@guards';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { forkJoin, from, Observable } from 'rxjs';
import { I_CONNECTION, I_FB_AUTH_RESPONSE, I_FB_PAGE_RESPONSE, I_USER } from '@interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { map, switchMap, tap } from 'rxjs/operators';
import { Model } from 'mongoose';
import { FacebookService } from '../service/facebook.service';
import { Request, Response } from 'express';
import { SanitizerUtil, TokenUtil } from '@utils';
import { UserHelper } from '@helpers';

@Controller('')
export class FacebookController {
  constructor(
    @InjectModel('User') private readonly userModel: Model<I_USER>,
    private readonly configService: ConfigService,
    private readonly profileService: FacebookService,
  ) {}

  @Get('authorize')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  async facebookAuth(@Query('connectionType') connectionType: string, @Res() response: Response): Promise<void> {
    const url = await this.profileService.authenticateFacebook(connectionType);
    response.redirect(url);
  }

  @Get('facebook-pages')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getFBPages(@Req() request: Request, @Query('code') code: string, @Query('connectionType') connectionType: string): Observable<I_FB_PAGE_RESPONSE> {
    const { authToken } = request.cookies,
      user = from(TokenUtil.verifyUser(authToken, this.configService)).pipe(
        switchMap((userInfo: Partial<I_USER>) => {
          const { email, _id } = userInfo;
          return from(UserHelper.findUserByEmailAndID(this.userModel, email as string, _id)).pipe(
            map((response: Partial<I_USER>) => SanitizerUtil.sanitizedResponse(response)),
          );
        }),
      ),
      authResponse$: Observable<I_FB_AUTH_RESPONSE> = this.profileService.authorizeFacebook(code, connectionType),
      pages = authResponse$.pipe(switchMap((authResponse: I_FB_AUTH_RESPONSE) => this.profileService.getFBPages(authResponse)));

    return forkJoin({ user, pages }).pipe(map((response: I_FB_PAGE_RESPONSE) => response));
  }

  @Get('facebook-groups')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getFBGroups(@Req() request: Request, @Query('code') code: string, @Query('connectionType') connectionType: string): Observable<I_FB_PAGE_RESPONSE> {
    const { authToken } = request.cookies,
      user = from(TokenUtil.verifyUser(authToken, this.configService)).pipe(
        switchMap((userInfo: Partial<I_USER>) => {
          const { email, _id } = userInfo;
          return from(UserHelper.findUserByEmailAndID(this.userModel, email as string, _id)).pipe(
            map((response: Partial<I_USER>) => SanitizerUtil.sanitizedResponse(response)),
          );
        }),
      ),
      authResponse$: Observable<I_FB_AUTH_RESPONSE> = this.profileService.authorizeFacebook(code, connectionType),
      pages = authResponse$.pipe(switchMap((authResponse: I_FB_AUTH_RESPONSE) => this.profileService.getFBGroups(authResponse)));

    return forkJoin({ user, pages }).pipe(
      tap(console.warn),
      map((response: I_FB_PAGE_RESPONSE) => response),
    );
  }

  @Post('facebook-page')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  addFBPage(@Body() addFBPageDTO: AddConnectionDTO): Observable<I_CONNECTION> {
    return this.profileService.addFBPage(addFBPageDTO);
  }

  @Post('facebook-group')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  addFBGroup(@Body() addFBPageDTO: AddConnectionDTO): Observable<I_CONNECTION> {
    return this.profileService.addFBPage(addFBPageDTO);
  }
}
