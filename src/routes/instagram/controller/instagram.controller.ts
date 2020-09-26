import { AuthGuard } from '@guards';
import { ConfigService } from '@nestjs/config';
import { Controller, Get, HttpCode, HttpStatus, Query, Req, Res, UseGuards } from '@nestjs/common';
import { forkJoin, from, Observable } from 'rxjs';
import { I_FB_AUTH_RESPONSE, I_FB_PAGE_RESPONSE, I_USER } from '@interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { map, switchMap } from 'rxjs/operators';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { SanitizerUtil, TokenUtil } from '@utils';
import { UserHelper } from '@helpers';
import { InstagramFacade } from '../facade/instagram.facade';

@Controller('')
export class InstagramController {
  constructor(
    @InjectModel('User') private readonly userModel: Model<I_USER>,
    private readonly configService: ConfigService,
    private readonly facade: InstagramFacade,
  ) {}

  @Get('authorize')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  async facebookAuth(@Query('connectionType') connectionType: string, @Res() response: Response): Promise<void> {
    const url = await this.facade.authenticateInstagram(connectionType);
    console.warn(url);

    response.redirect(url);
  }

  @Get('instagram-business')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  instagramAccounts(@Req() request: Request, @Query('code') code: string, @Query('connectionType') connectionType: string): Observable<I_FB_PAGE_RESPONSE> {
    const { authToken } = request.cookies,
      user = from(TokenUtil.verifyUser(authToken, this.configService)).pipe(
        switchMap((userInfo: Partial<I_USER>) => {
          const { email, _id } = userInfo;
          return from(UserHelper.findUserByEmailAndID(this.userModel, email as string, _id)).pipe(
            map((response: Partial<I_USER>) => SanitizerUtil.sanitizedResponse(response)),
          );
        }),
      ),
      authResponse$: Observable<I_FB_AUTH_RESPONSE> = this.facade.authorizeInstagram(code, connectionType),
      pages = authResponse$.pipe(switchMap((authResponse: I_FB_AUTH_RESPONSE) => this.facade.getInstagramAccounts(authResponse)));

    return forkJoin({ user, pages }).pipe(map((response: I_FB_PAGE_RESPONSE) => response));
  }
}
