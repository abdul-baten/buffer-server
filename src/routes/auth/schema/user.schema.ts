import { HookNextFunction, Schema } from 'mongoose';
import { UserDefinition } from '../definition/user.definition';
import { hash } from 'bcrypt';

const SALT_ROUNDS = 12;

export const UserSchema = new Schema(UserDefinition, {
  toJSON: { getters: true, virtuals: true },
});

UserSchema.pre('save', function(next: HookNextFunction) {
  const user: any = this;

  if (!user.isModified('password')) next();

  hash(user.password, SALT_ROUNDS)
    .then((hashedPassword: string) => {
      user.password = hashedPassword;
      next();
    })
    .catch((error: any) => next(error));
});
