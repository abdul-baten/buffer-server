import to from 'await-to-js';
import { AuthErrorCodes, EUserErrorMessage, UserErrorCodes } from '@errors';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenService } from '@utils';
import type { IJwtToken, IUser } from '@interfaces';

@Injectable()
export class UserService {
  constructor (@InjectModel('User') private readonly userModel: Model<IUser>, private readonly tokenService: TokenService) {}

  public async findUser (user_email: string, user_id: string): Promise<IUser> {
    const [error, user] = await to(this.userModel.
      findOne({
        _id: user_id,
        user_email
      }).
      lean(true).
      exec());

    if (error) {
      throw new InternalServerErrorException({
        ...UserErrorCodes.COULD_NOT_FOUND,
        error_details: error
      });
    }

    if (!user) {
      throw new NotFoundException({
        ...UserErrorCodes.COULD_NOT_FOUND,
        error_details: new Error(EUserErrorMessage.COULD_NOT_FOUND)
      });
    }

    return user as IUser;
  }

  public async getUserInfo (auth_token: string): Promise<IUser> {
    let error,
      token_info,
      user_info;

    [error, token_info] = await to(this.tokenService.jwtVerify(auth_token));

    if (error) {
      throw new InternalServerErrorException({
        ...AuthErrorCodes.AUTH_TOKEN_INVALID,
        error_details: error
      });
    }

    const { user_email, user_id } = token_info as IJwtToken;

    [error, user_info] = await to(this.findUser(user_email as string, user_id as string));

    if (error) {
      throw new NotFoundException({
        ...UserErrorCodes.COULD_NOT_FOUND,
        error_details: error
      });
    }

    return user_info as IUser;
  }
}
