/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable consistent-this */
import { hash } from 'bcrypt';
import { HookNextFunction, Schema } from 'mongoose';
import { UserDefinition } from '@definitions';
import { IUser } from '@interfaces';

const salt_rounds = 12;

export const UserSchema = new Schema(UserDefinition, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON: {
    getters: true,
    virtuals: true
  }
});

UserSchema.pre<IUser>('save', function hook (next: HookNextFunction) {
  if (!this.isModified('user_password')) {
    // eslint-disable-next-line callback-return
    next();
  }

  hash(this.user_password, salt_rounds).
    then((hashed_password: string) => {
      this.user_password = hashed_password;
      next();
    }).
    catch((error: Error) => next(error));
});
