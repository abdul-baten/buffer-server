import * as jsonTransformer from 'jsonata';
import { I_CONNECTION } from '@interfaces';

export class LinkedInMapper {
  static profileResponseMapper(pageInfo: any): I_CONNECTION {
    const response = `{
        "connectionCategory": $.category,
        "connectionID": 'urn:li:person:' & $.id,
        "connectionName": $.localizedFirstName & ' ' & $.localizedLastName,
        "connectionNetwork": $.connectionNetwork,
        "connectionPicture": **.elements[0].identifiers.identifier,
        "connectionToken": $.accessToken
    }`;

    return jsonTransformer(response).evaluate(pageInfo);
  }

  static mediaRegisterResponseMapper(registerMediaInfo: any): Record<string, string> {
    const response = `{
      "uploadUrl": **.uploadUrl,
      "media": *.asset,
      "status": 'READY'
    }`;

    return jsonTransformer(response).evaluate(registerMediaInfo);
  }

  static orgsResponseMapper(pageInfo: Partial<I_CONNECTION>): I_CONNECTION {
    const response = `{
        "connectionCategory": $.connectionCategory,
        "connectionID": $.connectionID,
        "connectionName": $.connectionName,
        "connectionNetwork": $.connectionNetwork,
        "connectionToken": $.connectionToken
    }`;

    return jsonTransformer(response).evaluate(pageInfo);
  }
}
