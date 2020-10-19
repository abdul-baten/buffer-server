import to from 'await-to-js';
import { EUserErrorMessage } from '@errors';
import { Injectable } from '@nestjs/common';
import type { IUser } from '@interfaces';
import type { Model } from 'mongoose';

@Injectable()
export class UserHelperService {
  public async findUserByEmailAndID (model: Model<IUser>, user_email: string, user_id: string): Promise<IUser> {
    const [error, user] = await to(model.
      findOne({
        _id: user_id,
        user_email
      }).
      select('-user_password -__v').
      lean(true).
      exec());

    if (error) {
      throw new Error(error.message);
    }

    if (!user) {
      throw new Error(EUserErrorMessage.COULD_NOT_FOUND);
    }

    return user as IUser;
  }

  public async findUserByEmail (model: Model<IUser>, user_email: string): Promise<IUser> {
    const [error, user] = await to(model.findOne({ user_email }).select('-__v').
      lean(true).
      exec());

    if (error) {
      throw new Error(error.message);
    }

    if (!user) {
      throw new Error(EUserErrorMessage.COULD_NOT_FOUND);
    }

    return user as IUser;
  }
}
