import jsonTransformer from 'jsonata';
import type { IUser } from '@interfaces';

export class UserMapper {
  static userResponseMapper (user_info: Partial<IUser>): IUser {
    const user = `
    {
      "id": $._id,
      "subscription": $.subscription,
      "createdAt": $.createdAt,
      "updatedAt": $.updatedAt,
      "userSuspended": $.userSuspended,
      "fullName": $.fullName,
      "email": $.email
    }
    `;

    return jsonTransformer(user).evaluate(user_info);
  }
}
