import * as jsonTransformer from 'jsonata';
import type { IUser } from '@interfaces';

export class AuthMapper {
  static signupValidationMapper (error: Error): string {
    const response = `{"errors": **.properties.message}`;

    return jsonTransformer(response).evaluate(error);
  }

  static userResponseMapper (user_info: Partial<IUser>): IUser {
    const response = `
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

    return jsonTransformer(response).evaluate(user_info);
  }
}
