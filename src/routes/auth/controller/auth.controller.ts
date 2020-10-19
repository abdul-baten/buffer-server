import { AuthFacade } from '../facade/auth.facade';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Response
} from '@nestjs/common';
import { ClearCookies } from '@nestjsplus/cookies';
import { ConfigService } from '@nestjs/config';
import { serialize } from 'cookie';
import { UserEnterDto, UserJoinDto } from '@dtos';
import type { FastifyReply } from 'fastify';
import type { IUser } from '@interfaces';

@Controller('')
export class AuthController {
  constructor (
    private readonly configService: ConfigService,
    private readonly facade: AuthFacade
  ) { }

  @Post('join')
  async joinUser (@Body() create_user_dto: UserJoinDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const { auth_token, user_info } = await this.facade.userJoin(create_user_dto);
    const cookie_options = this.configService.get('COOKIE');

    response.
      header('x-response-time', response_time).
      header('Set-Cookie', serialize('auth_token', auth_token, cookie_options)).
      status(HttpStatus.CREATED).
      type('application/json').
      send(user_info as IUser);
  }

  @Post('enter')
  public async enterUser (@Body() user_enter_dto: UserEnterDto, @Response() response: FastifyReply): Promise<void> {
    const response_time: number = response.getResponseTime();
    const { auth_token, user_info } = await this.facade.userEnter(user_enter_dto);
    const cookie_options = this.configService.get('COOKIE');

    response.
      header('x-response-time', response_time).
      header('Set-Cookie', serialize('auth_token', auth_token, cookie_options)).
      status(HttpStatus.OK).
      type('application/json').
      send(user_info as IUser);
  }

  @Get('logout')
  @ClearCookies('auth_token')
  public logoutUser (@Response() response: FastifyReply): void {
    const response_time: number = response.getResponseTime();

    response.
      header('x-response-time', response_time).
      redirect('https://localhost:5000/enter');
  }
}
