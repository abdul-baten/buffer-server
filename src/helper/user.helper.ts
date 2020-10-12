import to from 'await-to-js';
import { EUserErrorMessage, UserErrorCodes } from '@errors';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { IUser } from '@interfaces';
import type { Model } from 'mongoose';

@Injectable()
export class UserHelperService {
  public async findUserByEmailAndID (model: Model<IUser>, email: string, mongo_user_id: string): Promise<IUser> {
    const [error, user] = await to(model.
      findOne({
        _id: mongo_user_id,
        email
      }).
      lean().
      exec());

    if (error) {
      throw new Error(error.message);
    }

    if (!user) {
      throw new NotFoundException(UserErrorCodes.COULD_NOT_FOUND);
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
