import to from 'await-to-js';
import { AuthErrorCodes, UserErrorCodes } from '@errors';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenService } from '@utils';
import type { IUser } from '@interfaces';

@Injectable()
export class UserService {
  constructor (@InjectModel('User') private readonly userModel: Model<IUser>, private readonly tokenService: TokenService) {}

  public async findUser (email: string, user_id: string): Promise<IUser> {
    const [error, user] = await to(this.userModel.
      findOne({
        _id: user_id,
        email }).
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
        ...UserErrorCodes.COULD_NOT_FOUND
      });
    }

    return user as IUser;
  }

  public async getUserInfo (auth_token: string): Promise<IUser> {
    const [error, user] = await to(this.tokenService.jwtVerify(auth_token));

    if (error) {
      throw new InternalServerErrorException({
        ...AuthErrorCodes.AUTH_TOKEN_INVALID,
        error_details: error
      });
    }

    const { user_email, id } = user as Partial<IUser>;
    const user_info: IUser = await this.findUser(user_email as string, id as string);

    return user_info;
  }
}
