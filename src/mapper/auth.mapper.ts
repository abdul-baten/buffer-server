import jsonTransformer from 'jsonata';
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
      "user_created": $.user_created,
      "user_email": $.user_email,
      "user_full_name": $.user_full_name,
      "user_is_suspended": $.user_is_suspended,
      "user_subscription_plan": $.user_subscription_plan,
      "user_updated": $.user_updated
    }
    `;

    return jsonTransformer(response).evaluate(user_info);
  }
}
