import { AddConnectionDTO } from '../dto/connection.dto';
import { AuthGuard } from '@app/guards/auth.guard';
import { ConfigService } from '@nestjs/config';
import { ConnectionService } from '../service/connection.service';
import { forkJoin, from, Observable } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { map, switchMap } from 'rxjs/operators';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { SanitizerUtil } from '@app/util/sanitizer/sanitizer.util';
import { TokenUtil } from '@app/util';
import {
  I_FB_AUTH_RESPONSE,
  I_FB_PAGE_RESPONSE,
  I_USER,
  I_CONNECTION,
} from '@app/interface';
import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';

@Controller('')
export class ConnectionController {
  constructor(
    @InjectModel('User') private readonly userModel: Model<I_USER>,
    private connectionService: ConnectionService,
    private configService: ConfigService,
  ) {}

  @Get('oauth/facebook')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  async facebookAuth(@Res() response: Response): Promise<any> {
    const url = await this.connectionService.authenticateFacebook();

    response.redirect(url);
  }

  @Get('getFBPages')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getFBPages(
    @Req() request: Request,
    @Query('code') code: string,
  ): Observable<I_FB_PAGE_RESPONSE> {
    const { authToken } = request.cookies,
      user = from(TokenUtil.verifyUser(authToken, this.configService)).pipe(
        switchMap((userInfo: Partial<I_USER>) => {
          const { email, _id } = userInfo;
          return from(
            this.userModel
              .find({ email, _id })
              .lean()
              .exec(),
          ).pipe(
            map(response => response[0]),
            map((response: Partial<I_USER>) =>
              SanitizerUtil.sanitizedResponse(response),
            ),
          );
        }),
      ),
      authResponse$: Observable<I_FB_AUTH_RESPONSE> = this.connectionService.authorizeFacebook(
        code,
      ),
      pages = authResponse$.pipe(
        switchMap((authResponse: I_FB_AUTH_RESPONSE) =>
          this.connectionService.getFBPages(authResponse),
        ),
      );

    return forkJoin({ user, pages }).pipe(
      map((response: I_FB_PAGE_RESPONSE) => response),
    );
  }

  @Post('addFBPage')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  addFBPage(@Body() addFBPageDTO: AddConnectionDTO): Observable<I_CONNECTION> {
    return this.connectionService.addFBPage(addFBPageDTO);
  }

  @Get('getConnections')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getConnections(@Query('userID') userID: string): Observable<I_CONNECTION[]> {
    return this.connectionService.getConnections(userID);
  }

  @Delete('deleteConnection')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteConnection(
    @Query('deletedID') deletedID: string,
  ): Observable<I_CONNECTION> {
    return this.connectionService.deleteConnection(deletedID);
  }
}
