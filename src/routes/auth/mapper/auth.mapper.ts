import * as jsonTransformer from 'jsonata';
import { I_USER } from '@app/interface';
import { SanitizerUtil } from '@app/util/sanitizer/sanitizer.util';

export class AuthMapper {
  static signupValidationMapper(validationError: any): string {
    const interestRate = `{"errors": **.properties.message}`;
    return jsonTransformer(interestRate).evaluate(validationError);
  }

  static userResponseMapper(userInfo: Partial<I_USER>): string {
    const userMap = `$`;
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
