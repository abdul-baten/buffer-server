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
      "email": $.email,
      "attribution": $.attribution,
      "businessType": $.businessType,
      "companyName": $.companyName,
      "companySize": $.companySize
    }
    `;
    const omittedUserInfo = SanitizerUtil.sanitizedResponse(userInfo);
    return jsonTransformer(userMap).evaluate(omittedUserInfo);
  }

  static memberResponse(memberInfo: Partial<I_USER>): Partial<I_USER> {
    const response = `{
            "attribution": $.attribution,
           "businessType": $.businessType,
           "companyName": $.companyName,
           "companySize": $.companySize,
           "plan": $.plan
         }`;

    return jsonTransformer(response).evaluate(memberInfo);
  }
}
