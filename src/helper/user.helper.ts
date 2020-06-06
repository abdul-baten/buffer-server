import { I_USER } from '@interfaces';
import { InternalServerErrorException } from '@nestjs/common';
import { LoggerUtil } from '@utils';
import { Model } from 'mongoose';

export class UserHelper {
  static findUserByEmailAndID(userModel: Model<I_USER>, email: string, _id: string): Promise<I_USER> {
    try {
      return userModel
        .findOne({ email, _id })
        .lean()
        .exec();
    } catch (error) {
      LoggerUtil.logError(error);
      throw new InternalServerErrorException(error);
    }
  }

  static findUserByID() {}

  static findUserByEmail() {}
}
