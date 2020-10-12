import { AuthGuard } from '@guards';
import {
  Controller,
  Get,
  HttpStatus,
  Request,
  Response,
  UseGuards
} from '@nestjs/common';
import { parse } from 'cookie';
import { UserFacade } from '../facade/user.facade';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { IUser } from '@interfaces';

@Controller('')
export class UserController {
  constructor (private readonly facade: UserFacade) {}

  @Get('')
  @UseGuards(AuthGuard)
  public async getUserInfo (@Request() request: FastifyRequest, @Response() response: FastifyReply): Promise<void> {
    const { auth_token } = parse(request.headers.cookie as string);
    const response_time: number = response.getResponseTime();
    const user: IUser = await this.facade.getUserInfo(auth_token);

    response.
      header('x-response-time', response_time).
      status(HttpStatus.OK).
      type('application/json').
      send(user);
  }
}
