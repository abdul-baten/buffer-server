import * as jsonTransformer from 'jsonata';
import { I_CONNECTION } from '@interfaces';

export class TwitterMapper {
  static twtProfileResponseMapper(profileInfo: any): I_CONNECTION {
    const response = `{
        "connectionCategory": $.connectionNetwork,
        "connectionID": $.id,
        "connectionName": $.name,
        "connectionNetwork": $.connectionNetwork,
        "connectionPicture": $.profile_image_url_https,
        "connectionToken": $.oauth_token
    }`;

    return jsonTransformer(response).evaluate(profileInfo);
  }
}
