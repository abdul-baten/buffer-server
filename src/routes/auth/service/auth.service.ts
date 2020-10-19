import to from 'await-to-js';
import {
  AuthErrorCodes,
  EUserErrorMessage,
  GeneralErrorCodes,
  UserErrorCodes
} from '@errors';
import { compare } from 'bcrypt';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenService } from '@utils';
import { UserHelperService } from '@helpers';
import type { IUser } from '@interfaces';
import type { UserEnterDto, UserJoinDto } from '@dtos';

@Injectable()
export class AuthService {
  constructor (@InjectModel('User') private readonly userModel: Model<IUser>, private readonly tokenService: TokenService, private readonly userHelperService: UserHelperService) {}

  private async signToken (user_id: string, user_email: string): Promise<string> {
    const [error, auth_token] = await to(this.tokenService.jwtSign({
      user_email,
      user_id
    }));

    if (error) {
      throw new InternalServerErrorException({
        ...AuthErrorCodes.NOT_AUTHENTICATED,
        error_details: error
      });
    }

    return auth_token as string;
  }

  private async comparePassword (user_password: string, hashed_password: string): Promise<void> {
    const [error, password_matched] = await to(compare(user_password, hashed_password));

    if (error) {
      throw new InternalServerErrorException({
        ...AuthErrorCodes.NOT_AUTHENTICATED,
        error_details: error
      });
    }

    if (!password_matched) {
      throw new NotFoundException({
        ...UserErrorCodes.PASSWORD_MISMATCH,
        error_details: new Error(EUserErrorMessage.PASSWORD_MISMATCH)
      });
    }
  }

  public async userEnter (user_enter_dto: UserEnterDto): Promise<{ auth_token: string, user_info: IUser }> {
    const { user_email, user_password } = user_enter_dto;
    const [error, user_info] = await to(this.userHelperService.findUserByEmail(this.userModel, user_email));

    if (error) {
      throw new NotFoundException({
        ...UserErrorCodes.COULD_NOT_FOUND,
        error_details: error
      });
    }

    const { user_password: password, _id: user_id } = user_info as IUser;

    await this.comparePassword(user_password, password);

    const auth_token = await this.signToken(user_id, user_email);

    return {
      auth_token,
      user_info: user_info as IUser
    };
  }

  public async userJoin (user_join_dto: UserJoinDto): Promise<{ auth_token: string, user_info: IUser }> {
    let error,
      auth_token,
      saved_user;
    const user_info = new this.userModel(user_join_dto);

    [error, saved_user] = await to(user_info.save());
    if (error) {
      throw new InternalServerErrorException({
        ...UserErrorCodes.COULD_NOT_SAVE,
        error_details: error
      });
    }

    const { id: user_id, user_email } = saved_user as IUser;

    [error, auth_token] = await to(this.tokenService.jwtSign({
      user_email,
      user_id
    }));
    if (error) {
      throw new InternalServerErrorException({
        ...GeneralErrorCodes.SOMETHING_WENT_WRONG,
        error_details: error
      });
    }

    Reflect.deleteProperty(saved_user as IUser, 'user_password');

    return {
      auth_token: auth_token as string,
      user_info
    };
  }
}
