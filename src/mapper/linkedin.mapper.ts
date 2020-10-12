import * as jsonTransformer from 'jsonata';
import type { IConnection } from '@interfaces';

export class LinkedInMapper {
  static profileResponseMapper (page_info: IConnection): IConnection {
    const response = `{
        "connection_category": $.category,
        "connection_id": 'urn:li:person:' & $.id,
        "connection_name": $.localizedFirstName & ' ' & $.localizedLastName,
        "connection_network": $.connection_network,
        "connection_picture": **.elements[0].identifiers.identifier,
        "connection_token": $.accessToken
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }

  static mediaRegisterResponseMapper (registered_media_info: Record<string, unknown>): Record<string, string> {
    const response = `{
      "uploadUrl": **.uploadUrl,
      "media": *.asset,
      "status": 'READY'
    }`;

    return jsonTransformer(response).evaluate(registered_media_info);
  }

  static orgsResponseMapper (page_info: Partial<IConnection>): IConnection {
    const response = `{
        "connection_category": $.connection_category,
        "connection_id": $.connection_id,
        "connection_name": $.connection_name,
        "connection_network": $.connection_network,
        "connection_token": $.connection_token
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }
}
