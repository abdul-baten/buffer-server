import * as jsonTransformer from 'jsonata';
import { I_USER } from '@interfaces';
import { SanitizerUtil } from '@utils';

export class AuthMapper {
  static signupValidationMapper(validationError: any): string {
    const interestRate = `{"errors": **.properties.message}`;
    return jsonTransformer(interestRate).evaluate(validationError);
  }

  static userResponseMapper(userInfo: Partial<I_USER>): I_USER {
    const userMap = `
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
    const omittedUserInfo = SanitizerUtil.sanitizedResponse(userInfo);
    return jsonTransformer(userMap).evaluate(omittedUserInfo);
  }
}
