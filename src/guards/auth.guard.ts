import { AuthErrorCodes, UserErrorCodes } from '@errors';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { parse } from 'cookie';
import { resolve } from 'bluebird';
import { to } from 'await-to-js';
import { TokenService } from '@utils';
import { UserHelperService } from 'src/helper';
import type { FastifyRequest } from 'fastify';
import type { IJwtToken, IUser } from '@interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (@InjectModel('User') private readonly userModel: Model<IUser>, private readonly tokenService: TokenService, private readonly userHelperService: UserHelperService) {}

  private async getUserInfo (auth_token: string): Promise<IJwtToken> {
    const [error, token_info] = await to(this.tokenService.jwtVerify(auth_token ?? ''));

    if (error) {
      throw new ForbiddenException({
        ...AuthErrorCodes.AUTH_TOKEN_INVALID,
        error_details: error });
    }

    return token_info as IJwtToken;
  }

  public async canActivate (context: ExecutionContext): Promise<boolean> {
    let error,
      cookie,
      user_info;
    const request = context.switchToHttp().getRequest() as FastifyRequest;

    [error, cookie] = await to(resolve(parse(request.headers.cookie ?? '')));

    if (error) {
      throw new ForbiddenException({
        ...AuthErrorCodes.AUTH_TOKEN_MISSING,
        error_details: error });
    }

    // eslint-disable-next-line no-extra-parens
    const token_info = await this.getUserInfo((cookie as any).auth_token);

    const { user_email, user_id } = token_info;

    [error, user_info] = await to(this.userHelperService.findUserByEmailAndID(this.userModel, user_email, user_id));

    if (error) {
      throw new ForbiddenException({
        ...UserErrorCodes.COULD_NOT_FOUND,
        error_details: error });
    }

    return Boolean(user_info);
  }
}
