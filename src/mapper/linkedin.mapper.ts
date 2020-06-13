import * as jsonTransformer from 'jsonata';
import { I_CONNECTION } from '@interfaces';

export class LinkedInMapper {
  static lnProfileResponseMapper(pageInfo: any): I_CONNECTION {
    const response = `{
        "connectionCategory": $.category,
        "connectionID": $.id,
        "connectionName": $.localizedFirstName & ' ' & $.localizedLastName,
        "connectionNetwork": $.connectionNetwork,
        "connectionPicture": **.elements[0].identifiers.identifier,
        "connectionToken": $.accessToken
    }`;

    return jsonTransformer(response).evaluate(pageInfo);
  }

  static lnMediaRegisterResponseMapper(registerMediaInfo: any): Record<string, string> {
    const response = `{
      "uploadUrl": **.uploadUrl,
      "media": *.asset,
      "status": 'READY'
    }`;

    return jsonTransformer(response).evaluate(registerMediaInfo);
  }
}
