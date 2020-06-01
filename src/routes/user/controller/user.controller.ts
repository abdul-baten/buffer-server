import { AuthGuard } from '@guards';
import { I_USER } from '@interfaces';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserService } from '../service/user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  @UseGuards(AuthGuard)
  getUserInfo(@Req() request: Request): Observable<I_USER> {
    const { authToken } = request.cookies;
    return this.userService.getUserInfo(authToken);
  }
}
