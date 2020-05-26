import { AuthGuard } from '@app/guards/auth.guard';
import { AuthMapper } from '../mapper/auth.mapper';
import { AuthService } from '../service/auth.service';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ClearCookies, SetCookies } from '@nestjsplus/cookies';
import { from, Observable, of } from 'rxjs';
import { I_USER } from '@app/interface';
import { Request, Response } from 'express';
import { UserEnterDTO } from '../dto/user-enter.dto';
import { UserJoinDTO } from '../dto/user-join.dto';
import { UserOnboardDTO } from '../dto/user-onboard.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Redirect,
  Req,
  Request as NestRequest,
  Res,
  UseGuards,
} from '@nestjs/common';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('join')
  @HttpCode(HttpStatus.CREATED)
  async joinUser(@Body() createUserDto: UserJoinDTO): Promise<any> {
    console.warn(createUserDto);

    const user = await this.authService.userJoin(createUserDto);
    return AuthMapper.userResponseMapper(user);
  }

  @Patch('onboard')
  @HttpCode(HttpStatus.CREATED)
  async onboardUser(
    @Body() userOnboardDTO: UserOnboardDTO,
    @Res() response: Response,
  ): Promise<any> {
    const { user, authToken } = await this.authService.userOnboard(
      userOnboardDTO,
    );
    response.cookie('authToken', authToken, { httpOnly: true, secure: true });
    response.json(user);
  }

  @Post('enter')
  @HttpCode(HttpStatus.OK)
  @SetCookies({ httpOnly: true, secure: true, sameSite: true })
  enterUser(
    @Body() createUserDto: UserEnterDTO,
    @NestRequest() request: any,
  ): Observable<Partial<I_USER>> {
    const userInfo = from(this.authService.userEnter(createUserDto));

    return userInfo.pipe(
      map((userInfo: any) => {
        const { user, token } = userInfo;
        request._cookies = [
          {
            name: 'authToken',
            value: token,
          },
        ];

        return AuthMapper.userResponseMapper(user);
      }),
    );
  }

  @Post('verify')
  @HttpCode(HttpStatus.ACCEPTED)
  verifyToken(@Req() request: Request): Observable<{ verified: boolean }> {
    const cookie = request.cookies.authToken;

    if (!cookie) {
      return of({ verified: false });
    }

    const userVerified = from(this.authService.userVerify(cookie));
    return userVerified.pipe(
      mergeMap((userInfo: Partial<I_USER>) => {
        return from(
          this.authService.findUser(userInfo.email, userInfo._id),
        ).pipe(
          map((p: any) => ({ verified: !!p })),
          catchError(_ => of({ verified: false })),
        );
      }),
    );
  }

  @Get('getUserInfo')
  @UseGuards(AuthGuard)
  getUserInfo(@Req() request: Request): Observable<I_USER> {
    const { authToken } = request.cookies;
    return this.authService.getUserInfo(authToken);
  }

  @Get('logout')
  @ClearCookies('authToken')
  @Redirect('https://localhost:5000/enter', HttpStatus.FOUND)
  logoutUser() {}
}
