import { AuthMapper } from '@mappers';
import { AuthService } from '../service/auth.service';
import { ClearCookies, SetCookies } from '@nestjsplus/cookies';
import { from, Observable } from 'rxjs';
import { I_USER } from '@interfaces';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { UserEnterDTO, UserJoinDTO, UserOnboardDTO } from '@dtos';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Redirect,
  Request as NestRequest,
  Res,
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

  @Get('logout')
  @ClearCookies('authToken')
  @Redirect('https://localhost:5000/enter', HttpStatus.FOUND)
  logoutUser() {}
}
